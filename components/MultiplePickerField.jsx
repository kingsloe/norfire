import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';


const MultiplePickerField = ({items, title, values, setValues}) => {
    // const [selected, setSelected] = useState([]);

    const renderItem = item => {
        return (
          <View style={styles.item}>
              <Text style={styles.selectedTextStyle}>{item.label}</Text>
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
          </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 18}}>{title}</Text>
            <MultiSelect
              style={styles.picker}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={items}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              value={values}
              search
              searchPlaceholder="Search..."
              onChange={setValues}
              renderItem={renderItem}
              renderSelectedItem={(item, unSelect) => (
                  <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                      <View style={styles.selectedStyle}>
                          <Text style={styles.textSelectedStyle}>{item.label}</Text>
                          <AntDesign color="black" name="delete" size={17} />
                      </View>
                  </TouchableOpacity>
              )}
            />
        </View>
    )
};


export default MultiplePickerField;

const styles = StyleSheet.create({
    container: { marginTop: 28 },
    picker: {
        borderWidth: 2,
        borderRadius: 16,
        height: 60,
        paddingHorizontal: 15,
    },
    placeholderStyle: {
        color: "#9EA0A4"
    },
    selectedTextStyle: {
      fontSize: 14,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    icon: {
      marginRight: 5,
    },
    item: {
      padding: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectedStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
      backgroundColor: 'white',
      shadowColor: '#000',
      marginTop: 8,
      marginRight: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    },
    textSelectedStyle: {
      marginRight: 5,
      fontSize: 16,
    },

});