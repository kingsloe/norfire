import { 
    getCountFromServer, 
    query, 
    collection, 
    where, 
    getAggregateFromServer, 
    sum, 
    getDocs, 
    doc, 
    getDoc,
    toDate,
    Timestamp } from "firebase/firestore";
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
        const querySnapshot = query(targetDocument, where('position', 'in', ['member_of_committee', 'head_of_committee']));
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
            label: doc.data().subFamilyName,
            subFamilyHeadName: doc.data().subFamilyHeadName
        }));
        return subFamilies;
    } catch (error) {
        console.error(`Failed to fetch sub families: `, error);
    };
};

const getSuperFamily = async () => {
    try {
        const targetDocument = await getDocs(
            collection(FIREBASE_FIRESTORE, 'superFamily')
        );
        const superFamily = targetDocument.docs.map(doc => ({
            value: doc.id,
            label: doc.data().superFamilyName
        }));
        return superFamily;
    }catch (error){
        console.error('Failed to fetch Super Family ', error);
    };
};

const getDeadMembers = async () => {
    try{
        const targetDocument = await getDocs(
            query(
                collection(FIREBASE_FIRESTORE, 'familyMembers'), 
                where('isAlive', '==', false)
            )
        );
        const deadMembers = targetDocument.docs.map(doc => ({
            value: doc.id,
            label: doc.data().firstName + ' ' + doc.data().lastName,
        }));
        return deadMembers; 
    } catch (error) {
        console.error('Failed to get Dead Members ', error);
    }
};

const getAliveMembers = async () => {
    try{
        const targetDocument = await getDocs(
            query(
                collection(FIREBASE_FIRESTORE, 'familyMembers'), 
                where('isAlive', '==', true)
            )
        );
        const aliveMembers = targetDocument.docs.map(doc => ({
            value: doc.id,
            label: `${doc.data().firstName} ${doc.data().lastName}`,
            subFamilyId: doc.data().subFamily,
            gender: doc.data().gender,
            memberRef: doc.ref,
            balance: doc.data().balance
        }))
        return aliveMembers; 
    } catch (error) {
        console.error('Failed to get alive members ', error);
    }
};

const getCommitteeMembers = async () => {
    try {
        const targetDocument = await getDocs(
            query(
                collection(FIREBASE_FIRESTORE, 'familyMembers'), 
                where('position', 'in', ['member_of_committee', 'head_of_committee'])
            )
        );
        const committeeMembers = targetDocument.docs.map(doc => ({
            value: doc.id,
            label: doc.data().firstName + ' ' + doc.data().lastName
        }));
        return committeeMembers
    } catch (error) {
        console.error('Failed to get committee members ', error);
    }
}

const getSingleDocument = async (id, collection) => {
    try{
        const targetDocument = await getDoc(
            doc(FIREBASE_FIRESTORE, collection, id)
        );
        if (targetDocument.exists()) {
            const data = targetDocument.data();

            // Convert Firestore Timestamps to JavaScript Date objects
            const convertedData = Object.keys(data).reduce((acc, key) => {
                acc[key] = data[key]?.toDate ? data[key].toDate() : data[key];
                return acc;
            }, {});
            return {
                id: targetDocument.id, 
                ...convertedData};
        }else {
            console.error("No such document!");
            return null;
        }
    }catch (error) {
        console.log('Failed to get member details ', error);
        return null;
    }
}

const getFunerals = async (status) => {
    try {
        const targetDocument = await getDocs(
            query(
                collection(FIREBASE_FIRESTORE, 'funeral'),
                where('isActive', '==', status)
            )
        )
        const funerals = targetDocument.docs.map(doc => ({
            label: doc.data().deadMember,
            value: doc.id,
            funeralDate: doc.data().funeralDate?.toDate ? doc.data().funeralDate.toDate() : 'No Date'
        }));
        return funerals
    }catch (error) {
        console.log('Failed to get funerals ', error);
        return null;
    }
}

const getFuneralFeesByGender = async (gender) => {
    try {
        const targetDocument = await getDocs(
            query(
                collection(FIREBASE_FIRESTORE, 'funeralFees'),
                where('gender', '==', gender)
            )
        )
        const fees = targetDocument.docs.map(doc => ({
            amount: doc.data().amount
        }));
        return fees;
    } catch (error) {
        console.error ('Failed to get funeral fees', error);
        return null;
    }
}

const getFuneralFees = async () => {
    try {
        const targetDocument = await getDocs(
            collection(FIREBASE_FIRESTORE, 'funeralFees')
        )
        const fees = targetDocument.docs.map(doc => ({
            amount: doc.data().amount,
            gender: doc.data().gender
        }));
        return fees;
    } catch (error) {
        console.error ('Failed to get funeral fees', error);
    }
}

export { 
    getAliveAndDeadMembers, 
    getMembersByPosition, 
    getTotalFuneralFee, 
    getSubFamilies, 
    getSuperFamily, 
    getDeadMembers, 
    getCommitteeMembers, 
    getAliveMembers, 
    getSingleDocument,
    getFunerals,
    getFuneralFeesByGender,
    getFuneralFees
};