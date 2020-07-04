import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Alert, Modal, ScrollView, KeyboardAvoidingView} from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class WelcomeScreen extends Component{

constructor(){
    super();
    this.state={
        emailId:'',
        password:'',
        isModalVisible:false,
        firstName:'',
        lastName:'',
        address:'',
        contact:'',
        confirmPassword:'',
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

showModal=()=>{
  return(
    <Modal animationType='fade' transparent={true} visible={this.state.isModalVisible}>
        <View style={styles.modalContainer}>
        <ScrollView style={{width:'100%'}}>
        <KeyboardAvoidingView style={styles.keyBoardAvoidingView}>
        <Text style={styles.modalTitle}>REGISTRATION</Text>
                       <TextInput style={styles.formTextInput} placeholder='FIRST NAME' maxLength={8} onChangeText={(text)=>{this.setState({firstName:text})}}></TextInput>
                       <TextInput style={styles.formTextInput} placeholder='LAST NAME' maxLength={8} onChangeText={(text)=>{this.setState({lastName:text})}}></TextInput>
                       <TextInput style={styles.formTextInput} placeholder='CONTACT' maxLength={10} onChangeText={(text)=>{this.setState({contact:text})}} keyBoardType={'numeric'}></TextInput>
                       <TextInput style={styles.formTextInput} placeholder='ADDRESS' multiline={true} onChangeText={(text)=>{this.setState({address:text})}}></TextInput>
                       <TextInput style={styles.formTextInput} placeholder='Email' keyBoardType={'email-address'} onChangeText={(text)=>{this.setState({emailId:text})}}></TextInput>
                       <TextInput style={styles.formTextInput} placeholder='PASSWORD' secureTextEntry={true} onChangeText={(text)=>{this.setState({password:text})}}></TextInput>
                       <TextInput style={styles.formTextInput} placeholder='CONFIRM PASSWORD' secureTextEntry={true} onChangeText={(text)=>{this.setState({confirmPassword:text})}}></TextInput>
        
                       <View style={styles.modalBackButton}>
                           <TouchableOpacity style={styles.registeredButton} onPress={()=>{this.userSignUp(this.state.emailId, this.state.password, this.state.confirmPassword)}}>
                               <Text style={styles.registerButtonText}>REGISTER</Text>
                           </TouchableOpacity>
                       </View>
                       <View>
                           <TouchableOpacity style={styles.cancelButton} onPress={()=>{this.setState({isModalVisible:false})}}>
                               <Text style={{color:'white'}}>CANCEL</Text>
                           </TouchableOpacity>
                       </View>
                  
        </KeyboardAvoidingView>
        </ScrollView>
        </View>
    </Modal>
  )
}

userSignUp=(emailId, password, confirmPassword)=>{
    if(password!==confirmPassword){
        return(
            Alert.alert('PASSWORD DOES NOT MATCH')
        )
    }
    else{
    firebase.auth().createUserWithEmailAndPassword(emailId, password)
    .then(()=>{
        db.collection('users').add({
            first_name:this.state.firstName,
            last_name:this.state.lastName,
            contact:this.state.contact,
            email_id:this.state.emailId,
            address:this.state.address,
        })
        return(
            Alert.alert('USER ADDED SUCCESFULLY', '', [{text:'ok', onPress:()=>{this.setState({isModalVisible:false})}}])
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
}

render(){
    return(
        <View style={styles.container}>
            {this.showModal()}
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
keyBoardAvoidingView:{flex:1, justifyContent:'center', alignItems:'center'},
modalTitle:{justifyContent:'center', alignSelf:'center', fontsize:30, color:'black', margin:50},
modalContainer:{flex:1, borderRadius:20, justifyContent:'center', alignItem:'center', backgroundColor:'white', marginRight:30, marginLeft:30, marginTop:80, marginBottom:80},
formTextInput:{width:'75%', height:35, alignSelf:'center', borderColor:'black', borderRadius:10, borderWidth:1, marginTop:20, padding:10},
registeredButton:{width:200, height:40, alignItems:'center', justufyContent:'center', borderWidth:1, borderRadius:10, marginTop:30},
registerButtonText:{color:'black', fontSize:15, fontWeight:'bold'},
cancelButton:{width:200, height:30, justifyContent:'center', alignItems:'center', marginTop:5},
})
