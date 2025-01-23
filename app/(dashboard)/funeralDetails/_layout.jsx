import { Stack } from 'expo-router';
import React from 'react';
import {Button} from 'react-native';

const funeralDetailsLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="[id]" options={{
				headerShown: false, 
				headerTitle: 'Funeral Details',
			}} />
		</Stack>
	)
}

export default funeralDetailsLayout