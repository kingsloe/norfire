import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getFamilyMemberDetails } from '../../../libs/aggregationQueries';

export default function MemberDetails() {
  const { id } = useLocalSearchParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const memberDetails = await getFamilyMemberDetails(id);
        setMember(memberDetails);
      } catch (error) {
        console.error('Error fetching member details:', error);
      } finally {
        setLoading(false);
      }
    };
    console.log(id)
    fetchMemberDetails();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!member) {
    return <Text>Member not found.</Text>;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{member.firstName}{member.lastName}</Text>
      <Text style={{ marginTop: 8 }}>SubFamily: {member.subFamily}</Text>
      <Text style={{ marginTop: 8 }}>Balance: {member.balance}</Text>
      {/* Add other member details here */}
    </View>
  );
}
