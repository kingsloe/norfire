import { router } from 'expo-router';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
export default function Avatar ({otherStyles, initial}) {
    return (
        <TouchableOpacity onPress={() => router.push('/profile')}>
            <Text style={[styles.avatar, otherStyles]}>{initial}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    avatar: {
        backgroundColor: '#283033',
        color: '#F4FDFF'
      }
})