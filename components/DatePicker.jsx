import React, { useState } from 'react';
import { View, Text, Button, Platform, StyleSheetm, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from '@expo/vector-icons/AntDesign';

const DatePickerComponent = ({title, date, setDate, handleChangeDate, showDatePicker, showPicker}) => {

    return (
        <View style={{marginTop: 20}}>
            <Text style={styles.label}>{title}</Text>
            <View style={styles.container}>
            <Text style={styles.dateText}>
                {date.toLocaleDateString()}
            </Text>

            <TouchableOpacity onPress = {showDatePicker}>
                <AntDesign name="caretdown" size={10} color="gray" style={{padding: 16}} />
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date" 
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
                    onChange={handleChangeDate}
                />
            )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: 16,
        height: 60,
        width: '100%',
        borderWidth: 2,
        borderRadius: 16,
        flexDirection: 'row',
    },
    label: {
        fontSize: 18,
        // fontWeight: 'bold',
    },
    dateText: {
        fontSize: 18,
        marginVertical: 10,
        paddingHorizontal: 16,
        flex: 1,
    },
});

export default DatePickerComponent;
