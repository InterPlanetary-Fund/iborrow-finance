import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  InputAdornment,
  Button
} from '@material-ui/core'
import { colors } from '../../theme'

import Loader from '../loader'
import Snackbar from '../snackbar'

import {
  ERROR,
  CONFIGURE_RETURNED,
  DEPOSIT_VAULT,
  DEPOSIT_VAULT_RETURNED,
  WITHDRAW_VAULT,
  WITHDRAW_VAULT_RETURNED,
  GET_BALANCES,
  BALANCES_RETURNED,
  DEPLOY_VAULT,
  DEPLOY_VAULT_RETURNED,
  GET_VAULTS,
  VAULTS_RETURNED,
  GET_BORROWER_VAULTS,
} from '../../constants'

import Store from "../../store";
const dispatcher = Store.dispatcher
const emitter = Store.emitter
const store = Store.store

const styles = theme => ({
  root: {
    padding: '60px',
    width: '1200px'
  },
  addressContainer: {
    background: colors.white,
    borderRadius: '50px',
    padding: '30px 42px',
    border: '1px solid rgba(25, 101, 233, 0.5)',
    flex: 1,
    marginBottom: '40px',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  },
  container: {
    background: colors.white,
    borderRadius: '50px',
    padding: '30px 42px',
    flex: 1,
    marginBottom: '40px',
    border: '1px solid rgba(25, 101, 233, 0.5)',
  },
  between: {
    width: '40px'
  },
  totalsContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  grey: {
    color: colors.darkGray
  },
  half: {
    display: 'flex'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    marginRight: '16px'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  title: {
    paddingRight: '24px'
  },
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionButton: {
    marginTop: '20px',
    height: '47px'
  },
  deployVaultContainer: {

  },
  heading: {
    paddingBottom: '20px'
  },
  online: {
    border: '7px solid '+colors.green,
    borderRadius: '7px'
  },
  offline: {
    border: '7px solid '+colors.red,
    borderRadius: '7px'
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  }
});

class Collateral extends Component {

  state = {
    loading: (store.getStore('assets') == null || store.getStore('assets').length == 0),
    snackbarType: null,
    snackbarMessage: null,
    assets: store.getStore('assets').filter((asset) => { return (asset.balance > 0 || asset.vaultBalance > 0) }),
    vaults: store.getStore('vaults'),
    vault: store.getStore('vault'),
    account: store.getStore('account')
  };

  componentWillMount() {
    emitter.on(DEPOSIT_VAULT_RETURNED, this.depositVaultReturned);
    emitter.on(WITHDRAW_VAULT_RETURNED, this.withdrawVaultReturned);
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
    emitter.on(DEPLOY_VAULT_RETURNED, this.deployoVaultReturned);
    emitter.on(VAULTS_RETURNED, this.vaultsReturned);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(ERROR, this.errorReturned);
  };

  componentWillUnmount() {
    emitter.removeListener(DEPOSIT_VAULT_RETURNED, this.depositVaultReturned);
    emitter.removeListener(WITHDRAW_VAULT_RETURNED, this.withdrawVaultReturned);
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(DEPLOY_VAULT_RETURNED, this.deployoVaultReturned);
    emitter.removeListener(VAULTS_RETURNED, this.vaultsReturned);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  configureReturned = () => {
    dispatcher.dispatch({ type: GET_VAULTS, content: {} })
    dispatcher.dispatch({ type: GET_BORROWER_VAULTS, content: {} })
  }

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  balancesReturned = () => {
    this.setState({ assets: store.getStore('assets').filter((asset) => { return (asset.balance > 0 || asset.vaultBalance > 0) }), loading: false })
  }

  vaultsReturned = () => {
    this.setState({
      loading: false,
      vault: store.getStore('vault'),
      vaults: store.getStore('vaults')
    })

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
  }

  deployoVaultReturned = (vault) => {
    dispatcher.dispatch({ type: GET_VAULTS, content: {} })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: vault, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  }

  depositVaultReturned = (txHash) => {
    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    dispatcher.dispatch({ type: GET_VAULTS, content: {} })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: 'Deposit successfully submitted', snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  }

  withdrawVaultReturned = (txHash) => {
    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    dispatcher.dispatch({ type: GET_VAULTS, content: {} })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: "Withdrawal successfully submitted", snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  }

  render() {
    const {
      classes
    } = this.props

    const {
      loading,
      vaults,
      vault,
      account,
      snackbarMessage
    } = this.state

    var vaultAddr = null;
    if (vault && vault.address) {
      vaultAddr = vault.address.substring(0,6)+'...'+vault.address.substring(vault.address.length-4,vault.address.length)
    }

    var address = null;
    if (account && account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.half }>
          <div className={ classes.addressContainer }>
            <Typography variant='h3' className={ classes.walletTitle } >Wallet</Typography>
            <Typography variant='h4' className={ classes.walletAddress } >{ address ? address : 'Not connected' }</Typography>
            { address != null && <div className={ classes.online }></div> }
            { address == null && <div className={ classes.offline }></div> }
          </div>
          <div className={ classes.between }>
          </div>
          <div className={ classes.addressContainer }>
            <Typography variant='h3' className={ classes.walletTitle } >Vault</Typography>
            <Typography variant='h4' className={ classes.walletAddress } >{ vaultAddr ? vaultAddr : 'Not connected' }</Typography>
            { vaultAddr != null && <div className={ classes.online }></div> }
            { vaultAddr == null && <div className={ classes.offline }></div> }
          </div>
        </div>
        {
          (!vaults) &&
            <div className={ classes.container }>
              <div className={ classes.deployVaultContainer }>
                <Typography variant='h3' className={ classes.grey }>Loading your vaults...</Typography>
              </div>
            </div>
        }
        {
          (vaults && vaults.length === 0) &&
            <div className={ classes.container }>
              <div className={ classes.deployVaultContainer }>
                <Typography variant='h3' className={ classes.grey }>You first need to create a vault to start providing collateral.</Typography>
                <Button
                  className={ classes.actionButton }
                  variant="outlined"
                  color="primary"
                  disabled={ loading }
                  onClick={ this.onDeployVault }
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Create Vault</Typography>
                </Button>
              </div>
            </div>
        }
        {
          (vaults && vaults.length > 0) &&
          <div className={ classes.container }>
            <div className={ classes.totalsContainer }>
              <div>
                <Typography variant='h3' className={ classes.grey }>Total Collateral</Typography>
                <Typography variant='h2'>$ { vault && vault.totalCollateralUSD ? (vault.totalCollateralUSD/(10**26)).toFixed(2) : '0.00' }</Typography>
              </div>
              <div>
                <Typography variant='h3' className={ classes.grey }>Total Liquidity</Typography>
                <Typography variant='h2'>$ { vault && vault.availableBorrowsUSD ? (vault.availableBorrowsUSD/(10**26)).toFixed(2) : '0.00' }</Typography>
              </div>
              <div>
                <Typography variant='h3' className={ classes.grey }>Total Borrowed</Typography>
                <Typography variant='h2'>{ vault.borrowSymbol === '$' ? vault.borrowSymbol : '' } { vault && vault.totalBorrowsUSD ? (vault.totalBorrowsUSD/(10**26)).toFixed(2) : '0.00' } { vault.borrowSymbol !== '$' ? vault.borrowSymbol : '' }</Typography>
              </div>
            </div>
          </div>
        }
        {
          (vaults && vaults.length > 0) &&
            <div className={ classes.half }>
              <div className={ classes.container }>
                <Typography variant='h3' className={ `${classes.grey} ${classes.heading}` }>Deposit Assets</Typography>
                { this.renderDepositAssets() }
                <Button
                  className={ classes.actionButton }
                  variant="outlined"
                  color="primary"
                  disabled={ loading }
                  onClick={ this.onDeposit }
                  fullWidth
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Deposit</Typography>
                </Button>
              </div>
              <div className={ classes.between }>
              </div>
              <div className={ classes.container }>
                <Typography variant='h3' className={ `${classes.grey} ${classes.heading}` }>Withdraw Assets</Typography>
                { this.renderWithdrawAssets() }
                <Button
                  className={ classes.actionButton }
                  variant="outlined"
                  color="primary"
                  disabled={ loading }
                  onClick={ this.onWithdraw }
                  fullWidth
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Withdraw</Typography>
                </Button>
              </div>
            </div>
        }
        { loading && <Loader /> }
        { snackbarMessage && this.renderSnackbar() }
      </div>
    )
  };

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  renderDepositAssets = () => {
    const assets = this.state.assets

    return assets.map((asset) => {
      return this.renderAssetInput(asset, 'deposit')
    })
  }

  renderWithdrawAssets = () => {
    const assets = this.state.assets

    return assets.map((asset) => {
      return this.renderAssetInput(asset, 'withdraw')
    })
  }

  renderAssetInput = (asset, type) => {
    const {
      classes
    } = this.props

    const {
      loading
    } = this.state

    const amount = this.state[asset.id + '_' + type]
    const amountError = this.state[asset.id + '_' + type + '_error']

    return (
      <div className={ classes.valContainer }>
        <div className={ classes.balances }>
          { type === 'deposit' && <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.balance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset ? asset.symbol : '' }</Typography> }
          { type === 'withdraw' && <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.vaultBalance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.vaultBalance ? (Math.floor(asset.vaultBalance*10000)/10000).toFixed(4) : '0.0000') } { asset ? asset.symbol : '' }</Typography> }
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading }
            className={ classes.actionInput }
            id={ '' + asset.id + '_' + type }
            value={ amount }
            error={ amountError }
            onChange={ this.onChange }
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><Typography variant='h3' className={ '' }>{ asset.symbol }</Typography></InputAdornment>,
              startAdornment: <InputAdornment position="end" className={ classes.inputAdornment }>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../assets/'+asset.id+'-logo.png') }
                    height="30px"
                  />
                </div>
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    )
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  setAmount = (id, type, balance) => {
    const bal = (Math.floor((balance === '' ? '0' : balance)*10000)/10000).toFixed(4)
    let val = []
    val[id + '_' + type] = bal
    this.setState(val)
  }

  onDeployVault = () => {
    this.setState({ loading: true })
    dispatcher.dispatch({ type: DEPLOY_VAULT, content: {  } })
  }

  onDeposit = () => {
    this.setState({ amountError: false })
    let state = this.state

    const sendAssets = state.assets.map((asset) => {
      asset.amount = state[asset.id + '_deposit']
      if(asset.amount == null || asset.amount === '') {
        asset.amount = 0
      }
      return asset
    }).filter((asset) => {
      return asset.amount > 0
    })

    this.setState({ loading: true })
    dispatcher.dispatch({ type: DEPOSIT_VAULT, content: { assets: sendAssets } })
  }

  onWithdraw = () => {
    this.setState({ amountError: false })
    let state = this.state

    const sendAssets = state.assets.map((asset) => {
      asset.amount = state[asset.id + '_withdraw']
      if(asset.amount == null || asset.amount === '') {
        asset.amount = 0
      }
      return asset
    }).filter((asset) => {
      return asset.amount > 0
    })

    this.setState({ loading: true })
    dispatcher.dispatch({ type: WITHDRAW_VAULT, content: { assets: sendAssets } })
  }
}

export default withStyles(styles)(Collateral);
