import { Stack, router } from 'expo-router';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Button } from "react-native";

const DashboardLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="addFamilyMember" options={{headerShown: true, headerTitle: 'Add Family Member'}} />
            <Stack.Screen name="viewFamilyMembers" options={{headerShown: true, headerTitle: 'View Family Members'}} />
            <Stack.Screen name='addFuneral' options={{headerShown: true, headerTitle: 'Add Funeral'}} />
            <Stack.Screen name='viewFunerals' options={{headerShown: true, headerTitle: 'View Funerals'}} />
            <Stack.Screen name='addFuneralFee' options={{headerShown: true, headerTitle: 'Add Funeral Fee'}} />
            <Stack.Screen name='viewFuneralFees' options={{
                headerShown: true, 
                headerTitle: 'View Funeral Fees'
            }} />
            <Stack.Screen name='addSubFamily' options={{
                headerShown: true, 
                headerTitle: 'Add Sub Family'
            }} />
            <Stack.Screen name='viewSubFamilies' options={{
                headerShown: true, 
                headerTitle: 'View Sub Families'
            }} />
            <Stack.Screen name='funeralDetails' options={{
                headerShown: true, 
                headerTitle: 'Funeral Details', 
                headerTitleAlign: 'center',
            }} />
            <Stack.Screen name='membersToMakePayment' options={{
                headerShown: false, 
                headerTitle: 'Fee Payers', 
                headerTitleAlign: 'center',
            }}/>
            <Stack.Screen name='makePayment' options={{headerShown: true, headerTitle: 'Payment', headerTitleAlign: 'center'}} />
        </Stack>
    )
}

export default DashboardLayout