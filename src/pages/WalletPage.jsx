import Wallet from '../components/wallet/Wallet.jsx'
import TokenFactory from '../components/wallet/TokenFactory.jsx'

function WalletPage() {
  return (
    <div className="App">
      <TokenFactory/>
      <Wallet/>
      
    </div>
  );
}

export default WalletPage;
