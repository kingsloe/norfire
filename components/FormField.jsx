import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';

import { icons } from '../constants';

const FormField = ({title, handleChangeText, value, placeholder, otherStyles, ...props}) => {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={otherStyles}>
        <Text style={{fontSize: 18}}>{title}</Text>
        <View style={styles.input_container}>
            <TextInput 
                style={styles.input_style}
                value={value}
                placeholder={placeholder}
                onChangeText={handleChangeText}
                secureTextEntry={title === 'Password' && !showPassword}
                {...props}
            />
            { title === 'Password' && (
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Image 
                        source={!showPassword ? icons.eye : icons.eyeHide}
                        resizeMode='contain'
                        style={styles.icon}
                    />
                </TouchableOpacity>
            )}
        </View>
    </View>
  )
}

export default FormField

const styles = StyleSheet.create({
    input_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: '100%',
        paddingHorizontal: 16,
        borderWidth: 2,
        borderRadius: 16,
    },
    input_style: {
        flex: 1,
        width: '100%',
        fontSize: 18
    },
    icon: {
        width: 24,
        height: 24,
    }
})