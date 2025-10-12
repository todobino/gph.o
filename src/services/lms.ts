
'use client';
import { db } from '@/lib/firestore';
import type { Course } from '@/types/course';
import { collection, getDocs, query, where, doc, getDoc, setDoc, serverTimestamp, limit } from 'firebase/firestore';
import { useUser } from '@/hooks/useUser';
import { getAuth } from 'firebase/auth';

// --- QUERIES ---

export async function listCatalog(opts?: { q?: string }): Promise<Course[]> {
    const q = query(
        collection(db, "courses"),
        where("active", "==", true),
        where("type", "==", "self-paced")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
    const q = query(
        collection(db, "courses"),
        where("slug", "==", slug),
        where("active", "==", true),
        where("type", "==", "self-paced"),
        limit(1)
    );
    const snap = await getDocs(q);
    const doc = snap.docs[0];
    return doc ? { id: doc.id, ...doc.data() } as Course : null;
}


// --- MUTATIONS ---

export async function enroll(input: { courseId: string }): Promise<{ ok: boolean }> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User must be signed in to enroll.");

    const id = `${user.uid}_${input.courseId}`;
    const enrollmentRef = doc(db, "enrollments", id);

    await setDoc(enrollmentRef, {
        userId: user.uid,
        courseId: input.courseId,
        status: "active",
        enrolledAt: serverTimestamp(),
        source: "manual",
      }, { merge: true });
    
    return { ok: true };
}

export async function trackProgress(input: {
    courseSlug: string;
    lessonId: string;
    positionSeconds: number;
    completed?: boolean;
}): Promise<{ ok: boolean }> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User must be signed in to track progress.");

    const courseSnap = await getDocs(query(collection(db, "courses"), where("slug", "==", input.courseSlug), limit(1)));
    const courseId = courseSnap.docs[0]?.id;
    if (!courseId) throw new Error("Course not found");

    const id = `${user.uid}_${courseId}_${input.lessonId}`;
    const progressRef = doc(db, "progress", id);

    await setDoc(progressRef, {
        userId: user.uid,
        courseId,
        lessonId: input.lessonId,
        positionSeconds: input.positionSeconds,
        completed: !!input.completed,
        updatedAt: serverTimestamp(),
      }, { merge: true });

    return { ok: true };
}
