import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import HistoryItem from '../components/HistoryItem';

const HistoryScreen: React.FC = () => {
  const data: string[] = ['sds', 'home'];
  return (
    <View>
      <FlatList
        data={data}
        style={styles.historyListContainer}
        keyExtractor={(item: string, id: number) => id.toString()}
        renderItem={({item}) => <HistoryItem historyItemData={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  historyListContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});

export default HistoryScreen;
