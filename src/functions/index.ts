
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { FieldValue } from 'firebase-admin/firestore';

admin.initializeApp();
const db = admin.firestore();

exports.updateCohortSeats = onDocumentWritten("courses/{courseId}/cohorts/{cohortId}/attendees/{attendeeId}", async (event) => {
    const { courseId, cohortId } = event.params;
    if (!courseId || !cohortId) {
        console.error("Missing courseId or cohortId in params", event.params);
        return;
    }
    
    const cohortDocRef = db.collection('courses').doc(courseId).collection('cohorts').doc(cohortId);

    try {
        await db.runTransaction(async (transaction) => {
            const cohortDoc = await transaction.get(cohortDocRef);
            if (!cohortDoc.exists) {
                throw new Error(`Cohort document ${cohortId} does not exist.`);
            }

            const cohortData = cohortDoc.data();
            if (!cohortData) {
                throw new Error(`Cohort data is empty for ${cohortId}.`);
            }

            const attendeesCollectionRef = cohortDocRef.collection('attendees');
            
            // Query for confirmed and pending attendees separately
            const confirmedAttendeesQuery = attendeesCollectionRef.where('status', '==', 'confirmed');
            const pendingAttendeesQuery = attendeesCollectionRef.where('status', '==', 'pending');

            const [confirmedSnapshot, pendingSnapshot] = await Promise.all([
                transaction.get(confirmedAttendeesQuery),
                transaction.get(pendingAttendeesQuery)
            ]);
            
            const seatsConfirmed = confirmedSnapshot.size;
            const seatsHeld = pendingSnapshot.size;
            const seatsTotal = cohortData.seatsTotal || 0;
            const seatsRemaining = seatsTotal - seatsConfirmed - seatsHeld;

            transaction.update(cohortDocRef, { 
                seatsConfirmed: seatsConfirmed,
                seatsHeld: seatsHeld,
                seatsRemaining: seatsRemaining,
                updatedAt: FieldValue.serverTimestamp()
            });
        });
        console.log(`Successfully updated seat counts for cohort ${cohortId}.`);
    } catch (e) {
        console.error(`Transaction to update cohort seats for ${cohortId} failed:`, e);
    }
});
