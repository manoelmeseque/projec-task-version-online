import React, { Component } from 'react'
import {
    ImageBackground,
    Text, 
    StyleSheet,
    View,
    TouchableOpacity,
    Alert
} from 'react-native'

import axios from 'axios'

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyle from '../commonStyles'
import AuthInput from '../components/AuthInput'

import { server, showError, showSuccess } from '../common'

const initalState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false

}

export default class Auth extends Component{

    state = {
        ...initalState
    }

    signinOrSignup = () => {
        if(this.state.stageNew){
            this.signup()
        }else{
            this.signin()
        }
    }

    signup = async () => {

        try{
            await axios.post(`${server}/signup`, {

                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword

            })

            showSuccess('Usuário cadastrado!')
            this.setState({ initalState })
        }catch(e){
            showError(e)
        }

    }

    signin = async () => {
        try{
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password, 
            })

            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home')

        }catch(e){
            showError(e)
        }
    }



    render(){

        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if(this.state.stageNew){
            validations.push(this.state.name && this.state.name.trim().length >= 3)
            validations.push(this.state.confirmPassword === this.state.password)
        }

        const validForm = validations.reduce((anterior, atual) => anterior && atual)

        return(
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>

                {this.state.stageNew && <Text style={styles.subtitle}>Crie a sua conta</Text>}

                    {this.state.stageNew && 
                    <AuthInput icon="user" 
                        placeholder="Nome" 
                        value={this.state.name}
                        onChangeText={name => this.setState({name})}
                        style={styles.input}
                    />
                    
                    }

                    <AuthInput icon="at"
                        placeholder="E-mail" 
                        value={this.state.email}
                        onChangeText={email => this.setState({email})}
                        style={styles.input}
                    />
                    <AuthInput icon="lock"
                        placeholder="Senha"
                        value={this.state.password}
                        secureTextEntry={true}
                        onChangeText={password => this.setState({ password })}
                        style={styles.input}
                    />
                    {this.state.stageNew&&
                    <AuthInput icon="asterisk"
                        placeholder="Confirme sua senha"
                        value={this.state.confirmPassword}
                        secureTextEntry={true}
                        onChangeText={confirmPassword => this.setState({ confirmPassword })}
                        style={styles.input}
                    />
                    }

                    <TouchableOpacity 
                        disabled={!validForm}
                        activeOpacity={0.6}
                        onPress={() => this.signinOrSignup()}
                    >
                    <View style={[styles.button, validForm ? {} : { backgroundColor: "#AAA" }]}>

                        <Text style={styles.buttonText}>
                            {this.state.stageNew ? 'Cadastrar' : 'Entrar'}
                        </Text>

                    </View>
                    </TouchableOpacity>

                </View>
                <TouchableOpacity 
                    style={{ padding: 10 }}
                    onPress={() => this.setState({ stageNew: !this.state.stageNew})}
                >
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>

                </TouchableOpacity>

            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title:{
        fontFamily: commonStyle.fontFamily,
        color: commonStyle.colors.secondary,
        fontSize: 70,
        marginBottom: 10,
    },
    subtitle:{
        fontFamily: commonStyle.fontFamily,
        color: '#FFF',
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center'
    },
    formContainer:{
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        width: '90%'
    },
    input:{
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button:{
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7

    },
    buttonText:{
        fontFamily: commonStyle.fontFamily,
        color: '#fff',
        fontSize: 20,

    }
})