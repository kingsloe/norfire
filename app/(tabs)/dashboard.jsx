import { StyleSheet, Text, SectionList, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import CustomButton from '../../components/CustomButton';
import StatisticsCard from '../../components/StatisticsCard';
import Avatar from '../../components/Avatar';
import { images} from '../../constants';

const DATA = [
  {
    title: 'Super Family Information',
    data: [
      {
        title: 'Add Super Family',
        link: 'addSuperFamily',
      },
      {
        title: 'View Super Families',
        link: 'viewSuperFamilies',
      },
    ],
  },
  {
    title: 'Sub Family Information',
    data: [
      {
        title: 'Add Sub Family',
        link: 'addSubFamily',
      },
      {
        title: 'View Sub Families',
        link: 'viewSubFamilies',
      },
    ],
  },
  {
    title: 'Family Information',
    data: [
      {
        title: 'Add Family Member',
        link: 'addFamilyMember',
      },
      {
        title: 'View Family Members',
        link: 'viewFamilyMembers',
      }
    ],
  },
  {
    title: 'Funeral Information',
    data: [
      {
        title: 'Add Funeral',
        link: 'addFuneral',
      },
      {
        title: 'View Funerals',
        link: 'viewFunerals',
      },
    ],
  },
  {
    title: 'Funeral Fees',
    data: [
      {
        title: 'Add Funeral Fee',
        link: 'addFuneralFee',
      },
      {
        title: 'View Funeral Fees',
        link: 'viewFuneralFees',
      },
    ],
  },
];

export default function Dashboard () {

  return (
    <SafeAreaView>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <CustomButton 
            containerStyles={styles.customButtonStyle}
            title = {item.title}
            icon = <FontAwesome5 name="arrow-right" size={24} color="black" />
            handlePress={() => router.push(item.link)}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
        ListHeaderComponent={() => (
          <View style={styles.container}>
            <View style={styles.topBar}>
              <Image 
                style={styles.logoOnlyStyle}
                source = {images.logoOnly}
              />
              <Avatar 
                otherStyles={styles.avatar}
              />
            </View>
            <View style={styles.dashboardStyle}>
              <StatisticsCard />
            </View>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoOnlyStyle: {
    width: 54,
    height: 54,
  },
  avatar: {
    padding: 12,
    borderRadius: 50,
    fontWeight: '500',
    fontSize: 18,
  },
  dashboardStyle: {
    paddingVertical: 10,
    flex: 1,
  },
  customButtonStyle: {
    marginHorizontal: 18, 
    marginVertical: 12, 
    borderRadius: 30,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  header: {
    marginHorizontal: 18,
    fontSize: 20,
    fontWeight: '500',
  }
})