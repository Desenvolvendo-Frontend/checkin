import { useState } from "react";

import { 
  Text ,
  View, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal,
  Share
} from "react-native";
import { MotiView } from 'moti'
import { Redirect } from "expo-router";
import { FontAwesome } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

import { useBadgeStore } from "@/store/badge-store";

import { colors } from "@/styles/colors";

import { Header } from "@/components/header";
import { Button } from "@/components/button";
import { QRCode } from "@/components/qrcode";
import { Credential } from "@/components/credential";


export default function Ticket(){
  const [showQRCOde,setShowQRCOde] = useState(false)

  const badgeStore = useBadgeStore()

  async function handleShare(){
    try{
      if(badgeStore.data?.checkInURL){
        await Share.share({
          message: badgeStore.data.checkInURL
        })
      }

    }catch(error){
      console.log(error)
      Alert.alert("Compartilhar", "Não foi possível compartilhar")
    }
  }

  async function handleSelectImage() {
    try{
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4,4]
      })

      if(result.assets){
        badgeStore.updateAvatar(result.assets[0].uri)
      }

    }catch(error){
      console.log(error)
      Alert.alert('Foto', 'Não foi possível selecionar a imagem')
    }
    
  }

  if(!badgeStore.data?.checkInURL){
    return <Redirect href="/"/>
  }


  return(
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle='light-content'/>
      <Header title="Minha Credencial"/>

      <ScrollView 
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential 
          data={badgeStore.data} 
          onChangeAvatar={handleSelectImage}
          onShowQRCode={()=> setShowQRCOde(true)}
        />

        <MotiView
          from={{
            translateY:0,
          }}
          animate={{
            translateY:10
          }}
          transition={{
            loop:true,
            type: "timing",
            duration: 700
          }}
        >
          <FontAwesome
          name="angle-double-down"
          color={colors.gray[300]}
          size={32}
          className="self-center my-6"
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar credencial
        </Text>

        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostre ao mundo que você vai participar do evento{" "}
          {badgeStore.data.eventTitle}!
        </Text>

        <Button title="Compartilhar" onPress={handleShare}/>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={()=> badgeStore.remove()}
          >
            <View className="mt-10">
              <Text className="text-base text-white font-bold text-center"> Remover Ingresso</Text>
            </View>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={showQRCOde} statusBarTranslucent animationType="slide">
        <View className="flex-1 bg-green-500 items-center justify-center">
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowQRCOde(false)}>
            <QRCode value="teste" size={300}/>
            <Text className="text-basse text-orange-500 font-bold text-center mt-14">
              Fechar QRCode
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}