import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from 'next/image';
import Seo from './components/Seo';
import Header from './components/Header';
import Footer from './components/Footer';

const Home: NextPage = () => {

  const [mintNum, setMintNum] = useState(0);
  const [mintQuantity, setmintQuantity] = useState(1);
  const [disabledFlag, setDisabledFlag] = useState(false);
  const abi = [
    'function totalSupply() public view virtual override returns (uint256)',
    "function mint(uint _mintAmount) public payable",
  ]
  const contractAddress = "0x6804CE54024181eBB48D1605fEACea63B9e0Cfc6"
  useEffect(() => {
    const setSaleInfo = async() =>{
      const provider = await new ethers.providers.Web3Provider((window as any).ethereum);
      const signer =  await provider.getSigner();
      const contract =await new ethers.Contract(contractAddress, abi, signer);

      try{
        const mintNumber = (await contract.totalSupply()).toString();
        console.log('mintNumber = ' + mintNumber);
        setMintNum(mintNumber);
      }catch(e){
        console.log(e);
      }
    };
    setSaleInfo();
  });

  // ミントボタン用
  function MintButton() {
    async function addChain() {
      try{
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
        const provider = await new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        setDisabledFlag(true);
      } catch(e) {
        console.log(e);
      }
      try{
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'sepolia',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 5,
            },
            rpcUrls: ['https://sepolia.infura.io/v3/1a0352a8d3284854a3a52d9b3b6bbf8f'],
          }],
        });
        console.log('try');
        setDisabledFlag(true);
      }catch(Exeption){
        console.log('Ethereum already Connected');
        console.log('catch');
      }finally{
        console.log('finally');
      }
    }
    const mintQuantityPlus = async () =>{
      if(mintQuantity == 3){
        return;
      } else {
        setmintQuantity(mintQuantity + 1);
      }
    };

    const mintQuantityMinus = async () =>{
      if(mintQuantity == 1){
        return;
      } else {
        setmintQuantity(mintQuantity - 1);
      }
    };
    
    const nftMint = async() => {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      await provider.send('eth_requestAccounts', []);
      const tokenPrice = '0.01';
      const quantity = String(mintQuantity);
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try{
        await contract.mint(quantity,{value: ethers.utils.parseEther(tokenPrice),gasLimit: 91000});
        alert('Starting to execute a transaction');
      }catch(err: any) {
      // JSONへ変換
        const jsonData = JSON.stringify(err.reason);
        alert(jsonData);
      }
    };
    return <>
    <div className="bg-gradient-to-b from-pink-200 to-purple-300 pb-16 flex flex-wrap justify-center items-center min-h-screen">
  <div className='px-8 pt-8 lg:px-28 lg:py-28 animate-bounce'>
    <Image className="rounded-full shadow-lg border-4 border-white" src="/main_grap.png" alt="Main Image" width={500} height={500}/>
  </div>
  <div className="m-12 lg:m-32 px-12 py-6 lg:pt-8 lg:px-20 border-4 rounded-3xl bg-white text-center border-pink-300 shadow-xl transform hover:scale-105 transition-transform duration-300">
    <h1 className="text-3xl lg:text-5xl pt-2 lg:pt-4 lg:pb-6 text-pink-500 font-bold font-['Comic Sans MS', 'Chalkboard SE', 'sans-serif']">MASAO</h1>
    <h1 className="text-2xl lg:text-4xl pt-2 lg:pt-4 lg:pb-6 text-purple-500 font-bold font-['Comic Sans MS', 'Chalkboard SE', 'sans-serif']"> {mintNum} / 5000</h1>
    <a className="text-2xl lg:text-4xl pt-2 lg:pt-8 lg:pb-8 text-pink-500 font-bold">5</a><a className="text-2xl lg:text-3xl pt-2 lg:pt-8 lg:pb-8 text-purple-400 font-bold">MAX</a><br/>
    
    <div className="pt-2 lg:pt-6 pb-7">
      <button type="button" className="text-2xl lg:text-3xl inline-flex flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] lg:h-[3.375rem] lg:w-[3.375rem]
      border-pink-300 border-2 font-bold bg-white text-pink-500 hover:bg-pink-100 focus:outline-none focus:ring-2
      focus:ring-pink-300 focus:ring-offset-2 transition-all rounded-full shadow-md" onClick={mintQuantityMinus}>
      -</button>
      <a className="text-2xl lg:text-3xl px-8 lg:pt-6 lg:pb-6 text-purple-500 font-bold">{mintQuantity}</a>
      <button type="button" className="text-2xl lg:text-3xl inline-flex flex-shrink-0 justify-center items-center gap-2 h-[2.375rem] w-[2.375rem] lg:h-[3.375rem] lg:w-[3.375rem]
      border-pink-300 border-2 rounded-full font-bold bg-white text-pink-500 hover:bg-pink-100 
      focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-all shadow-md" onClick={mintQuantityPlus}>
      +</button><br/>
    </div>
    { (!disabledFlag) && <button type="button" className="text-xl lg:text-2xl py-2 lg:py-4 px-12 lg:px-24 inline-flex justify-center items-center gap-2 rounded-full border-2
    bg-gradient-to-r from-pink-400 to-purple-400 border-white font-bold text-white hover:from-pink-500 hover:to-purple-500
      focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-all shadow-lg animate-pulse" onClick={() => addChain()}>
    CONNECT WALLET</button>}
    { (disabledFlag) && <button type="button" className="text-xl lg:text-2xl py-2 lg:py-4 px-12 lg:px-24 inline-flex justify-center items-center gap-2 rounded-full border-2
    bg-gradient-to-r from-pink-400 to-purple-400 border-white font-bold text-white hover:from-pink-500 hover:to-purple-500
      focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-all shadow-lg animate-pulse" onClick={() => nftMint()}>
    MINT NOW</button>}
  </div>
</div>
    </>
  }

  return (
    <div>
      <Seo
          pageTitle={'MASAO'}
          pageDescription={'MASAO'}
          pageImg={''}
          pageImgWidth={1920}
          pageImgHeight={1005}
      />
      <Header />
      <MintButton/>
      <Footer />
    </div>
    
  );
};

export default Home;
