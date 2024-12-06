import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, containerStyles, textStyles, icon}) => {
  return (

    <TouchableOpacity
        onPress={handlePress}
        style={[styles.button, containerStyles]}
    >
      <Text style={[styles.defaultText, textStyles]}>
        {title}
      </Text>
      {icon}
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#e09b5e',
        borderRadius: 12,
        minHeight: 64,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 20,
        shadowColor: '#52006A'
    }, 
    defaultText: {
        fontSize: 18,
    }
})