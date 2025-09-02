// components/forms/FormRenderer.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, serverTimestamp, updateDoc, arrayUnion, setDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/firestore";
import type { Form as FormDocType } from '@/types/subscriber';
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export function FormRenderer({ slug }: { slug: string }) {
  const [form, setForm] = useState<FormDocType | null>(null);
  const [lists, setLists] = useState<{id: string; name: string}[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle"|"submitting"|"done"|"error">("idle");
  const auth = getAuth();

  useEffect(() => {
    (async () => {
      // load form by slug
      const q = query(collection(db, "forms"), where("slug", "==", slug));
      const formsSnap = await getDocs(q);

      if (formsSnap.empty) {
          setForm(null);
          return;
      }
      
      const f = { id: formsSnap.docs[0].id, ...formsSnap.docs[0].data() } as FormDocType;
      
      if (!f) return setForm(null);
      setForm(f);

      if (f.assignMode === "choose") {
        // Load names for the target lists to render checkboxes
        const all = await getDocs(collection(db, "lists"));
        const map = new Map(all.docs.map(d => [d.id, d.data() as any]));
        const arr = f.targetListIds
          .filter((id: string) => map.get(id)?.isPublic)
          .map((id: string) => ({ id, name: map.get(id).name }));
        setLists(arr);
        setChecked(Object.fromEntries(arr.map(x => [x.id, true]))); // Default to checked
      }
    })();
  }, [slug]);

  if (form === null) return <div className="text-destructive">Form not found.</div>;
  if (!form) return <div />;

  const submit = async () => {
    try {
      setStatus("submitting");
      const user = auth.currentUser;
      if (!user && form.requireLogin) {
        setStatus("error");
        alert("Please sign in first.");
        return;
      }
      const uid = user!.uid;
      const subRef = doc(db, "subscribers", uid);
      const subSnap = await getDoc(subRef);
      const alreadyHadLists = subSnap.exists() && Array.isArray(subSnap.data().listIds) && subSnap.data().listIds.length > 0;

      const toAdd = form.assignMode === "fixed"
        ? form.targetListIds
        : Object.entries(checked).filter(([, v]) => v).map(([k]) => k);

      if (toAdd.length === 0) {
        setStatus("idle");
        return;
      }

      const updateData: any = { 
          updatedAt: serverTimestamp(),
          listIds: arrayUnion(...toAdd),
        };
      
      if (form.allowFirstTimeFlag && !alreadyHadLists) {
        updateData.firstSubscribedAt = serverTimestamp();
        updateData.sources = arrayUnion(`form:${form.slug}`);
      }
      
      if (subSnap.exists()) {
        await updateDoc(subRef, updateData);
      } else {
        // Create the subscriber doc if it doesn't exist
        await setDoc(subRef, {
            email: user?.email,
            displayName: user?.displayName,
            listIds: toAdd,
            createdAt: serverTimestamp(),
            ...updateData
        });
      }

      setStatus("done");
      if (form.redirectUrl) window.location.href = form.redirectUrl;
    } catch (e) {
      console.error(e);
      setStatus("error");
    } finally {
        if (status !== 'done') { // to prevent flicker if we redirect
            setStatus(s => s === 'submitting' ? 'idle' : s);
        }
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      {status === "done" ? (
         <p className="text-center text-green-600">{form.successMessage ?? "Thanks!"}</p>
      ) : (
        <>
            {form.assignMode === "choose" && (
                <div className="space-y-2 mb-4">
                {lists.map(l => (
                    <div key={l.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={`list-${l.id}`}
                        checked={!!checked[l.id]}
                        onCheckedChange={e => setChecked(prev => ({ ...prev, [l.id]: !!e }))}
                    />
                    <Label htmlFor={`list-${l.id}`} className="font-normal">{l.name}</Label>
                    </div>
                ))}
                </div>
            )}
            <Button onClick={submit} disabled={status==="submitting"} className="w-full">
                {status === 'submitting' ? 'Submitting...' : form.submitLabel ?? "Submit"}
            </Button>
            {status==="error" && <p className="mt-2 text-sm text-destructive">Something went wrong. Please try again.</p>}
        </>
      )}
    </div>
  );
}
