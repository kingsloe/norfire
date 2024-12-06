import { getCountFromServer, query, collection, where, getAggregateFromServer, sum, getDocs } from "firebase/firestore";
import { FIREBASE_FIRESTORE } from "../services/firebaseConfig";
const getMembersByStatus = async (status) => {
    try {
        const targetDocument = collection(FIREBASE_FIRESTORE, 'familyMembers');
        const querySnapshot = query(targetDocument, where('isAlive', '==', status));
        const snapshot = await getCountFromServer(querySnapshot);
        return snapshot.data().count;
    } catch (error) {
        console.error(`Failed to fetch alive members: ${status}: `, error);
    };
};

const getAliveAndDeadMembers = async () => {
    try {
        const aliveMembers = await getMembersByStatus(true);
        const deadMembers = await getMembersByStatus(false);
        return { aliveMembers, deadMembers };
    } catch (error) {
        console.error('Failed to fetch alive and deceased members:', error);
    };
};

const getMembersByPosition = async (status) => {
    try {
        const targetDocument = collection(FIREBASE_FIRESTORE, 'familyMembers');
        const querySnapshot = query(targetDocument, where('position', 'in', ['Committee Head', 'Committee Member']));
        const snapshot = await getCountFromServer(querySnapshot);
        return snapshot.data().count;
    } catch (error) {
        console.error(`Failed to fetch alive members: ${status}: `, error);
    };
};

const getTotalFuneralFee = async (status) => {
    try {
        const targetDocument = collection(FIREBASE_FIRESTORE, 'funeralFees');
        const snapshot = await getAggregateFromServer(targetDocument, {
            totalFeesTaken: sum('amount')
        });
        return snapshot.data().totalFeesTaken;
    } catch (error) {
        console.error(`Failed to fetch total fees taken: ${status}: `, error);
    };
};

const getSubFamilies = async () => {
    try {
        const targetDocument = await getDocs(collection(FIREBASE_FIRESTORE, 'subFamilies'));
        const subFamilies = targetDocument.docs.map(doc => ({
            value: doc.id,
            label: doc.data().subFamilyName
        }));
        return subFamilies;
    } catch (error) {
        console.error(`Failed to fetch sub families: `, error);
    };
};

const getSuperFamily = async () => {
    try {
        const targetDocument = await(getDocs(collection(FIREBASE_FIRESTORE, 'superFamily')))
        const superFamily = targetDocument.docs.map(doc => ({
            value: doc.id,
            label: doc.data().superFamilyName
        }));
        return superFamily;
    }catch (error){
        console.error('Failed to fetch Super Family', error);
    };
};

export { getAliveAndDeadMembers, getMembersByPosition, getTotalFuneralFee, getSubFamilies, getSuperFamily };