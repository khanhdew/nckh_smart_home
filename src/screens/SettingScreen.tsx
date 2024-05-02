import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {Button, Card, Icon} from 'react-native-paper';

const SettingScreen = () => {
  return (
    <ScrollView style={styles.screenContainer}>
      <Card style={styles.accountCard}>
        <Card.Actions style={{alignSelf: 'flex-end'}}>
          <Button>Đăng nhập</Button>
        </Card.Actions>
      </Card>
      <Button style={styles.settingItem}>
        <Text>Quản lý loại thiết bị</Text>
      </Button>
      <Button style={styles.settingItem}>
        <Text>Quản lý vị trí</Text>
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  accountCard: {
    height: 150,
    backgroundColor: '#ccc',
    padding: 10,
    justifyContent: 'flex-end',
  },
  settingItem: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default SettingScreen;
