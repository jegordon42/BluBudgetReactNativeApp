import React from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';

const About = () => {
    return (
        <View style={styles.page}>
            <Text style={styles.text}>
            Blu Budget was founded by Joe Gordon.
                The goal of this project was to get
                experience in app development as well as
                to get better with spending.
                Blu Budget has helped Joe achieve his goals
                and it can help you achieve yours!
            </Text>
            <Image style={styles.image} source={require('../../assets/Joe.png')} />
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text:{
        textAlign:'center',
        fontSize: 22,
    },
    image:{
        width:150, 
        height:150, 
        marginTop:25
    }
  });

export default About
