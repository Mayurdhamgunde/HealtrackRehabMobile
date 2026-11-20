import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackTopTab from '@/components/common/BackTopTab';

interface SessionItem {
  id: string;
  patientName: string;
  sessionType: string;
  time: string;
  status: 'Available' | 'In Progress' | 'Scheduled';
}

export default function ConnectScreen() {
  const [sessions] = useState<SessionItem[]>([
    {
      id: 'conn-1',
      patientName: 'Sandip K',
      sessionType: 'Remote Rehab Video Consultation',
      time: '13:30 Today',
      status: 'Available',
    },
    {
      id: 'conn-2',
      patientName: 'Sameer Raju',
      sessionType: 'Arm Therapy Check-in',
      time: '16:00 Today',
      status: 'Scheduled',
    },
    {
      id: 'conn-3',
      patientName: 'Rohit Rathod',
      sessionType: 'Post-Op Follow-up Call',
      time: '11:00 Tomorrow',
      status: 'Scheduled',
    },
  ]);

  const handleStartCall = (session: SessionItem) => {
    Alert.alert(
      'Connect Session',
      `Connecting to secure video session with ${session.patientName}...`,
      [{text: 'OK'}],
    );
  };

  return (
    <View style={styles.container}>
      <BackTopTab screenName="Connect" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>Teleconsultation & Chats</Text>
          <Text style={styles.headerSubtitle}>
            Connect with your patients for live video rehabilitation sessions
          </Text>
        </View>

        {sessions.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <Icon name="video-outline" size={24} color="#007B8E" />
              </View>
              <View style={styles.info}>
                <Text style={styles.patientName}>{item.patientName}</Text>
                <Text style={styles.sessionType}>{item.sessionType}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.callButton}
                activeOpacity={0.85}
                onPress={() => handleStartCall(item)}>
                <Icon name="video" size={18} color="#FFFFFF" />
                <Text style={styles.callButtonText}>Start Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chatButton}
                activeOpacity={0.85}
                onPress={() =>
                  Alert.alert('Chat', `Open messaging with ${item.patientName}`)
                }>
                <Icon name="chat" size={18} color="#007B8E" />
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007B8E',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerBox: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  patientName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sessionType: {
    fontSize: 13,
    color: '#9A9C9A',
    marginTop: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#007B8E',
    fontWeight: '600',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007B8E',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#007B8E',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  chatButtonText: {
    color: '#007B8E',
    fontSize: 14,
    fontWeight: '600',
  },
});

