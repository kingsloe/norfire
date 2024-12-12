import { Text, View, StyleSheet } from 'react-native';

import {Picker} from '@react-native-picker/picker';

const PickerField = ({title, value, items, handleChangeText, ...props}) => {

	return (
		<View style={styles.container}>
		    <Text style={{fontSize: 18}}>{title}</Text>
		    <View style={styles.picker}>
			    <Picker
			    	selectedValue={value}
			    	onValueChange={handleChangeText}
			    >
					<Picker.Item label="Select" value="" color="#9EA0A4" />
			    	{items.map((item) => (
                        <Picker.Item 
                            key={item.value} 
                            label={item.label} 
                            value={item.value} 
                        />
                    ))}
			    </Picker>
		    </View>
        </View>
	)
};

export default PickerField;

const styles = StyleSheet.create({
    container: {
    	marginTop: 28,
    },
    picker: {
    	borderWidth: 2,
    	borderRadius: 16,
    },
    
});
