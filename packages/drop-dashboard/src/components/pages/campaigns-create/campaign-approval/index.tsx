import { FC } from 'react'
import {
  WidgetControls,
  WidgetButton,
  WidgetDataSplit,
  WidgetDataBlock
} from '../styled-components'
import { RootState } from 'data/store';
import {
  Widget,
  DataBlock
} from 'components/common'
import { defineNetworkName, countTotalTokens, capitalize } from 'helpers'
import { useHistory } from 'react-router-dom'
import { TRetroDropType, TRecipientsData } from 'types'

import {
  approveERC1155,
  approveERC721,
  approveERC20
} from 'data/store/reducers/contract/async-actions'
import { Dispatch } from 'redux';
import { NewRetroDropActions } from 'data/store/reducers/new-retro-drop/types'
import { connect } from 'react-redux'
import { ContractActions } from 'data/store/reducers/contract/types'

type TProps = {
  recipients: TRecipientsData,
  cancel: () => void,
  dropTitle: string,
  dropLogoURL: string,
  dropDescription: string
}

const mapStateToProps = ({
  user: { address, provider, chainId },
  newRetroDrop: { loading, step, tokenAddress, ipfs, merkleTree, dropAddress, type, decimals },
  contract: { loading: contractLoading },
}: RootState) => ({
  loading,
  address,
  provider,
  ipfs,
  decimals,
  step,
  tokenAddress,
  merkleTree,
  chainId,
  contractLoading,
  dropAddress,
  type
})
const mapDispatcherToProps = (dispatch: Dispatch<ContractActions> & Dispatch<NewRetroDropActions>) => {
  return {
    approveERC1155: (
      provider: any,
      tokenAddress: string,
      userAddress: string,
      dropAddress: string,
      ipfsHash: string,
      title: string,
      address: string,
      chainId: number,
      description: string,
      dropLogoURL: string,
      recipientsData: TRecipientsData,
      type: TRetroDropType,
      decimals: number | null,
      callback: () => void
    ) => approveERC1155(
      dispatch,
      provider,
      tokenAddress,
      userAddress,
      dropAddress,
      ipfsHash,
      title,
      address,
      chainId,
      description,
      dropLogoURL,
      recipientsData,
      type,
      decimals,
      callback
    ),
    approveERC721: (
      provider: any,
      tokenAddress: string,
      userAddress: string,
      dropAddress: string,
      ipfsHash: string,
      title: string,
      address: string,
      chainId: number,
      description: string,
      dropLogoURL: string,
      recipientsData: TRecipientsData,
      type: TRetroDropType,
      decimals: number | null,
      callback: () => void
    ) => approveERC721(
      dispatch,
      provider,
      tokenAddress,
      userAddress,
      dropAddress,
      ipfsHash,
      title,
      address,
      chainId,
      description,
      dropLogoURL,
      recipientsData,
      type,
      decimals,
      callback
    ),
    approveERC20: (
      provider: any,
      tokenAddress: string,
      userAddress: string,
      dropAddress: string,
      ipfsHash: string,
      title: string,
      address: string,
      chainId: number,
      description: string,
      dropLogoURL: string,
      recipientsData: TRecipientsData,
      type: TRetroDropType,
      decimals: number | null,
      callback: () => void
    ) => approveERC20(
      dispatch,
      provider,
      tokenAddress,
      userAddress,
      dropAddress,
      ipfsHash,
      title,
      address,
      chainId,
      description,
      dropLogoURL,
      recipientsData,
      type,
      decimals,
      callback
    ),
  }
}
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps> & TProps

const CampaignApproval: FC<ReduxType> = ({
  dropTitle,
  cancel,
  chainId,
  recipients,
  contractLoading,
  tokenAddress,
  ipfs,
  provider,
  dropAddress,
  type,
  address,
  dropLogoURL,
  dropDescription,
  approveERC1155,
  approveERC721,
  approveERC20,
  decimals
}) => {
  const history = useHistory()
  return <Widget>
    <DataBlock
      title='Drop’s title'
      text={dropTitle}
    />
    <WidgetDataSplit>
      <WidgetDataBlock
        title='Network'
        text={capitalize(defineNetworkName(chainId))}
      />
      <WidgetDataBlock
        title='Type of token'
        text={(type || '').toUpperCase()}
      />
    </WidgetDataSplit>
    <DataBlock
      title='Token Address'
      text={tokenAddress || ''}
    />
    <DataBlock
      title='Drop contract'
      text={dropAddress || ''}
    />
    <WidgetDataSplit>
      <WidgetDataBlock
        title='Total tokens dropped'
        text={recipients ? countTotalTokens(recipients, type, decimals) : 0}
      />
      <WidgetDataBlock
        title='Recipients'
        text={Object.keys(recipients || {}).length}
      />
    </WidgetDataSplit>
    <WidgetControls>
      <WidgetButton
        title='Start over'
        appearance='default'
        onClick={cancel}
      />
      <WidgetButton
        title={contractLoading ? 'Approving' : 'Give approval'}
        disabled={!tokenAddress || !dropAddress || contractLoading}
        loading={contractLoading}
        appearance='default'
        onClick={() => {
          if (!tokenAddress || !dropAddress || !ipfs || !chainId || !type) { return }
          let method
          if (type === 'erc1155') { method = approveERC1155 }
          else if (type === 'erc721') { method = approveERC721 }
          else { method = approveERC20 }
          method(
            provider,
            tokenAddress,
            address,
            dropAddress,
            ipfs,
            dropTitle,
            address,
            chainId,
            dropDescription,
            dropLogoURL,
            recipients,
            type,
            decimals,
            () => {
              history.push('/')
            }
          )
        }}
      />
    </WidgetControls>
  </Widget>
}

export default connect(mapStateToProps, mapDispatcherToProps)(CampaignApproval)
