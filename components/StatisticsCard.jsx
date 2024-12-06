import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { mainButtonColor } from '../constants/colors';

import { getAliveAndDeadMembers, getMembersByPosition, getTotalFuneralFee } from '../libs/aggregationQueries';

const getIconForKey = (key) => {
    const iconMap = {
        alive_family_members: <MaterialIcons name="family-restroom" size={36} color="white" />,
        committee_members: <MaterialIcons name="family-restroom" size={36} color="white" />,
        deceased_family_members: <MaterialCommunityIcons name="emoticon-dead-outline" size={36} color="white" />,
        total_funeral_fee: <FontAwesome6 name="cedi-sign" size={36} color="white" />,
    };
    return iconMap[key] || <MaterialIcons name="family-restroom" size={36} color="white" />; // Fallback to a default icon
};

const Item = ({ title, figure, icon }) => {
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: '500' }}>{title}</Text>
            <View style={styles.recordContainer}>
                <Text style={{ fontSize: 36, fontWeight: '700' }}>{figure}</Text>
                {icon}
            </View>
        </View>
    )
}

const StatisticsCard = () => {
    const [response, setResponse] = useState([
        {
            id: '1',
            title: 'Alive Family Members',
            figure: 0,
            icon: getIconForKey('alive_family_members'),
        },
        {
            id: '3',
            title: 'Dead Family Members',
            figure: 0,
            icon: getIconForKey('deceased_family_members'),
        },
        {
            id: '2',
            title: 'Committee Members',
            figure: 0,
            icon: getIconForKey('committee_members'),
        },
        {
            id: '4',
            title: 'Total Funeral Fee',
            figure: 0,
            icon: getIconForKey('total_funeral_fee'),
        },
    ]);
    useEffect(() => {
        const fetched = async () => {
            try {
                const {aliveMembers, deadMembers} = await getAliveAndDeadMembers();
                const committeeMembers = await getMembersByPosition();
                const totalFuneralFee = await getTotalFuneralFee();
                setResponse(prevResponse => {
                    const updatedResponse = prevResponse.map(item => {
                        if (item.title === 'Alive Family Members') {
                            return { ...item, figure: aliveMembers };
                        }
                        if (item.title === 'Dead Family Members') {
                            return { ...item, figure: deadMembers };
                        }
                        if (item.title === 'Committee Members') {
                            return { ...item, figure: committeeMembers };
                        }
                        if (item.title === 'Total Funeral Fee') {
                            return { ...item, figure: totalFuneralFee };
                        }
                        return item;
                    });
                    return updatedResponse;
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetched();
    }, []);

  return (
    <FlatList 
        data = {response}
        horizontal
        renderItem={({ item }) => 
            <Item title={item.title}
            figure={item.figure}
            icon={item.icon}
            />
        }
        keyExtractor={item => item.id}
    />
  )
}

export default StatisticsCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: mainButtonColor,
        borderRadius: 36,
        paddingHorizontal: 36,
        paddingVertical: 20,
        margin: 18,
        height: 180,
        elevation: 20,
        shadowColor: '#52006A',
        justifyContent: 'space-between',
    },
    recordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textStyle: {
        fontSize: 20, 
        fontWeight: '500',
    },
})