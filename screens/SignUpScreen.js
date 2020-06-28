import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class WelcomeScreen extends Component{

constructor(){
    super();
    this.state={
        emailId:'',
        password:'',
    }
}

userLogin=(emailId, password)=>{
    firebase.auth().signInWithEmailAndPassword(emailId, password)
    .then(()=>{
        return(
            Alert.alert('SUCCESFULLY LOGGED IN')
        )
    })
    .catch((error)=>{
        var errorCode=error.errorCode
        var errorMessege=error.errorMessege
        return(
            Alert.alert(errorMessege)
        )
    })

    
}

userSignUp=(emailId, password)=>{
    firebase.auth().createUserWithEmailAndPassword(emailId, password)
    .then(()=>{
        return(
            Alert.alert('USER ADDED SUCCESFULLY')
        )
    })
    .catch((error)=>{
        var errorCode=error.errorCode
        var errorMessege=error.errorMessege
        return(
            Alert.alert(errorMessege)
        )
    })

    
}

render(){
    return(
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Text style={styles.title}>BARTER APP</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TextInput style={styles.loginBox} paceholder='abc@example.com' placeholderTextColor='red' keyboardType='email-address' onChangeText={(text)=>{this.setState({emailId:text})}}></TextInput>
                    <TextInput style={styles.loginBox} paceholder='password' placeholderTextColor='red' secureTextEntry={true} onChangeText={(text)=>{this.setState({password:text})}}></TextInput>
                    <TouchableOpacity style={[styles.button, {marginBottom:20, marginTop:20}]} onPress={()=>{this.userLogin(this.state.emailId, this.state.password)}}>
                        <Text style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()=>{this.userSignUp(this.state.emailId, this.state.password)}}>
                        <Text style={styles.buttonText}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
            
        </View>
    )
}

}
const styles=StyleSheet.create({
container:{flex:1, backgroundColor:'white'},
profileContainer:{flex:1, justifyContent:'center', alignItems:'center'},
loginBox:{width:300, height:40, borderBottomWidth:1.5, borderColor:'black', fontSize:20, margin:10, paddingLeft:10, justifyContent:'center', alignItems:'center'},
title:{fontSize:65, fontWeight:'300', paddingBottom:30, color:'black'},
button:{width:300, height:50, justifyContent:'center', alignItems:'center', borderRadius:25, backgroundColor:'green', shadowColor:'#000', shadowOffset:{width:0, height:8}, shadowOpacity:0.3, shadowRadius:10.3, elevation:16},
buttonText:{color:'white', fontWeight:'200', fontSize:20},
buttonConatiner:{flex:1, alignItems:'center', justifyContent:'center'},
})