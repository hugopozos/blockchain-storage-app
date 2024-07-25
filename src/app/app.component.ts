import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import * as simpleStorageAbi from '../assets/SimpleStorage.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true
})
export class AppComponent implements OnInit {
  web3: any;
  contract: any;
  contractAddress = '0xa336f980a17fd9E06de4E7b27F084925426bd53D'; // Dirección del contrato desplegado
  storedValue: number | undefined;

  async ngOnInit() {
    // Configurar Web3
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('No Ethereum browser detected');
    }

    // Instanciar el contrato
    this.contract = new this.web3.eth.Contract((simpleStorageAbi as any).abi, this.contractAddress);
    this.getValue();
  }

  async getValue() {
    const value = await this.contract.methods.get().call();
    this.storedValue = value;
  }

  async setValue(inputValue: string) {
    const accounts = await this.web3.eth.getAccounts();
    await this.contract.methods.set(inputValue).send({ from: accounts[0] });
    this.getValue();
  }
}
