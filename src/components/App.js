import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import { Container, Row, Col, Navbar, Form, Button } from 'react-bootstrap';

// import Navbar from './Navbar'
// import Main from './Main'
import './App.css'

// Contracts
import SimpleStorage from '../abis/SimpleStorage.json'

export default (props) => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [simpleStorageValue, setSimpleStorageValue] = useState('');
  const [isLoading, setLoadingState] = useState(false);
  const [isTransactionPending, setTransactionStatus] = useState(false);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    loadWeb3AndBlockchainData();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const loadSimpleStorageDate = async () => {
    const web3 = window.web3
    // Get network ID
    const networkId = await web3.eth.net.getId()

    // Load SimpleStoragee
    const simpleStorageData = SimpleStorage.networks[networkId]
    if(simpleStorageData) {
      // 0x90ACc2F72Bc78137946bD14d6f62a2968b9d2B57
      const contract = new web3.eth.Contract(SimpleStorage.abi, SimpleStorage.networks['5777'].address);
      setContract(contract);
      const simpleStorageValue = await contract.methods.getSimpleStorageValue().call();

      setSimpleStorageValue(simpleStorageValue);
    } else {
      window.alert('SimpleStorage contract not deployed to detected network.')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3

    // Set account to app state
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0]);

    await loadSimpleStorageDate();
  }

  const loadWeb3AndBlockchainData = async () => {
    setLoadingState(true);
    await loadWeb3();
    await loadBlockchainData();
    setLoadingState(false);
  }

  const updateValue = () => {
    setTransactionStatus(true);
    contract.methods.updateSimpleStorage(newValue).send({ from: account }).on('transactionHash', (hash) => {
      setTransactionStatus(false);
      console.log(hash);
      loadSimpleStorageDate();
    })
  }

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
    <Navbar bg="light" className="mb-5">
      <Navbar.Brand href="#home">🗃 Simple Storage by <a target="_blank" href="https://github.com/kiknaio">@kiknaio</a></Navbar.Brand>
    </Navbar>

    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <h3>Present Value: <pre>{simpleStorageValue}</pre></h3>

          {isTransactionPending && (
            <b>Transaction is processing... </b>
          )}
          
          <Form className="mt-5">
            <Form.Group controlId="updateValue">
              <Form.Label>Update value</Form.Label>
              <Form.Control
                type="text"
                placeholder="Provide a new value"
                onChange={({ target: { value } }) => setNewValue(value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={updateValue}>
              Update
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
  )
}

// class App extends Component {

//   async componentWillMount() {
//     await this.loadWeb3()
//     await this.loadBlockchainData()
//   }

//   async loadBlockchainData() {
//     const web3 = window.web3

//     const accounts = await web3.eth.getAccounts()
//     this.setState({ account: accounts[0] })

//     const networkId = await web3.eth.net.getId()

//     // Load DaiToken
//     const daiTokenData = DaiToken.networks[networkId]
//     if(daiTokenData) {
//       const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
//       this.setState({ daiToken })
//       let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
//       this.setState({ daiTokenBalance: daiTokenBalance.toString() })
//     } else {
//       window.alert('DaiToken contract not deployed to detected network.')
//     }

//     // Load DappToken
//     const dappTokenData = DappToken.networks[networkId]
//     if(dappTokenData) {
//       const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
//       this.setState({ dappToken })
//       let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
//       this.setState({ dappTokenBalance: dappTokenBalance.toString() })
//     } else {
//       window.alert('DappToken contract not deployed to detected network.')
//     }

//     // Load TokenFarm
//     const tokenFarmData = TokenFarm.networks[networkId]
//     if(tokenFarmData) {
//       const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
//       this.setState({ tokenFarm })
//       let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
//       this.setState({ stakingBalance: stakingBalance.toString() })
//     } else {
//       window.alert('TokenFarm contract not deployed to detected network.')
//     }

//     this.setState({ loading: false })
//   }

//   async loadWeb3() {
//     if (window.ethereum) {
//       window.web3 = new Web3(window.ethereum)
//       await window.ethereum.enable()
//     }
//     else if (window.web3) {
//       window.web3 = new Web3(window.web3.currentProvider)
//     }
//     else {
//       window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
//     }
//   }

//   stakeTokens = (amount) => {
//     this.setState({ loading: true })
//     this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
//       this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
//         this.setState({ loading: false })
//       })
//     })
//   }

//   unstakeTokens = (amount) => {
//     this.setState({ loading: true })
//     this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
//       this.setState({ loading: false })
//     })
//   }

//   constructor(props) {
//     super(props)
//     this.state = {
//       account: '0x0',
//       daiToken: {},
//       dappToken: {},
//       tokenFarm: {},
//       daiTokenBalance: '0',
//       dappTokenBalance: '0',
//       stakingBalance: '0',
//       loading: true
//     }
//   }

//   render() {
//     let content
//     if(this.state.loading) {
//       content = <p id="loader" className="text-center">Loading...</p>
//     } else {
//       content = <Main
//         daiTokenBalance={this.state.daiTokenBalance}
//         dappTokenBalance={this.state.dappTokenBalance}
//         stakingBalance={this.state.stakingBalance}
//         stakeTokens={this.stakeTokens}
//         unstakeTokens={this.unstakeTokens}
//       />
//     }

//     return (
//       <div>
//         <Navbar account={this.state.account} />
//         <div className="container-fluid mt-5">
//           <div className="row">
//             <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
//               <div className="content mr-auto ml-auto">
//                 <a
//                   href="http://www.dappuniversity.com/bootcamp"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                 </a>

//                 {content}

//               </div>
//             </main>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
