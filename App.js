import React, { useState } from 'react';
// loading화면 : assets-splash.png 파일을 불러온다
import AppLoading from "expo-app-loading";
import { Text, Image } from "react-native";
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
// expo에서 제공하는 icons중에서 Ionicons를 사용하기 위해 불러옴 https://icons.expo.fyi/
import { Ionicons } from "@expo/vector-icons";

// cacheImages 함수는 images를 인자로 받고 promise array를 return 함
const cacheImages = images => images.map(image => {
  // console.log(image)
  // 먼저 image가 string 형태(=url)면 prefetch로 return해주고, 그게 아니라면 Asset.fromModule(image).downloadAsync()를 사용해서 return 해준다
  if (typeof image === "string") {
    // prefetch : 나중에 사용하기 위해서 해당 데이터(image)를 디스크 캐시에 미리 다운로드 해 놓는다
    // https://docs.expo.io/versions/v40.0.0/react-native/image/#prefetch
    return Image.prefetch(image);
  } else {
    // Asset.fromModule(image) : asset instance를 반환한다. 파일의 경우 require('path/to/file')형태로 지정해줘야함
    // https://docs.expo.io/versions/v40.0.0/sdk/asset/#assetfrommodulemodule
    // FileSystem.downloadAsync(uri, fileUri, options) : FileSystem의 컨텐츠를 다운로드 함
    // https://docs.expo.io/versions/latest/sdk/filesystem/#filesystemdownloadasyncuri-fileuri-options
    return Asset.fromModule(image).downloadAsync();
  }
});

// font를 Font.loadAsync(font)로 미리 불러온다
// https://docs.expo.io/versions/v40.0.0/sdk/font/#fontloadasyncobject
const cacheFonts = fonts => fonts.map(font => Font.loadAsync(font));

export default function App() {
  // 1. 로딩 화면 제작(isReady가 true면 다음으로 넘어간다)
  const [isReady, setIsReady] = useState(false);
  const handleFinish = () => setIsReady(true);
  const loadAssets = async() => {
    // 사용할 image를 담을 배열 선언 후 image 담기
    // 파일로 저장한 image와 링크가 걸려있는 image를 배열에 담아준다
    const images = [
      // 파일로 저장한 image를 불러올때는 require(파일경로)를 사용해서 불러온다
      require("./assets/loginBg.jpeg"),
      "http://logok.org/wp-content/uploads/2014/07/airbnb-logo-belo-219x286.png"
    ];
    // console.log(cacheImages(images));
    // Promise array 값을 갖고 있다. Promise가 있다는건 나중에 무슨 일이 생긴다는 뜻이다
    // 여기서는 url을 prefetch하거나 이미지 파일을 predownloading 하는 것임
    // cacheImages 함수에 images를 넣고 나온 값(배열)을 imagePromises에 할당
    const imagePromises = cacheImages(images);
    // 우리가 사용할 font는 Ionicons.font이므로 이걸 배열에 넣어준다
    const fonts = [Ionicons.font];
    const fontPromises = cacheFonts(fonts);
    // console.log(imagePromises, fontPromises);
    // console.log(...imagePromises, ...fontPromises);
    return Promise.all([...fontPromises, ...imagePromises]);
  };
  return (
    isReady ? (
    <Text>
      It's Ready!
    </Text>
    ) : (
      // AppLoading은 초기 데이터를 불러오면서 걸리는 시간에 앱의 로딩 화면을 띄워주는 것
      // startAsync는 Promise를 return하는데 그 사이에 data와 assets 로딩을 완료한다, 그래서 위에 loadAssets 함수에 async를 써준다
      // onFinish는 startAsync의 활동이 끝나면 실행한다(보통 loading 미완료를 완료로 바꿔줌)
      // https://docs.expo.io/versions/latest/sdk/app-loading/
    <AppLoading 
      onError={console.error} 
      onFinish={handleFinish} 
      startAsync={loadAssets}/>)
  );
}
