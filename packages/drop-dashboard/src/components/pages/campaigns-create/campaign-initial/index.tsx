import { FC, useState } from 'react'
import {
  Widget
} from 'components/common'
import {
  WidgetInput,
  WidgetControls,
  WidgetButton
} from '../styled-components'
import { TRetroDropStep, TRetroDropType } from 'types'
import { NewRetroDropActions } from 'data/store/reducers/new-retro-drop/types'
import * as newRetroDropActions from 'data/store/reducers/new-retro-drop/actions'
import { Dispatch } from 'redux';
import { connect } from 'react-redux'
import { RootState } from 'data/store';
import * as newRetroDropAsyncActions from 'data/store/reducers/new-retro-drop/async-actions'
import { useHistory } from 'react-router-dom'

type TProps = {
  dropLogoURL: string,
  dropDescription: string,
  cancel: () => void
}

const mapStateToProps = ({
  newRetroDrop: { type },
  user: { provider }
}: RootState) => ({
  type,
  provider
})

const mapDispatcherToProps = (dispatch: Dispatch<NewRetroDropActions>) => {
  return {
    setTokenContractData: (tokenAddress: string, provider: any, type: TRetroDropType, callback: () => void) => newRetroDropAsyncActions.setTokenContractData(dispatch, tokenAddress, provider, type, callback),
  }
}
type ReduxType = ReturnType<typeof mapDispatcherToProps> & TProps & ReturnType<typeof mapStateToProps>

type TCreateDefaultTokenAddress = (dropType: TRetroDropType | null) => string

const createDefaultTokenAddress: TCreateDefaultTokenAddress = (type) => {
  return ''
  // switch (type) {
  //   case 'erc1155':
  //     return '0x35573543F290fef43d62Ad3269BB9a733445ddab'
  //   case 'erc721':
  //     return '0x29a0a05fcc86e27442d4a0b1b498e71f78b6c459'
  //   case 'erc20':
  //     return '0xaFF4481D10270F50f203E0763e2597776068CBc5'
  //   default:
  //     return ''
  // }
}

const CampaignInfo: FC<ReduxType> = ({
  cancel,
  setTokenContractData,
  type,
  provider
}) => {
  const [ currentTokenAddress, setCurrentTokenAddress ] = useState(createDefaultTokenAddress(type))
  const history = useHistory()
  return <Widget>
    <WidgetInput
      title='Contract address'
      onChange={value => { setCurrentTokenAddress(value); return value}}
      value={currentTokenAddress}
      placeholder='Enter contract address'
    />
    <WidgetControls>
      <WidgetButton
        title='Cancel'
        appearance='default'
        onClick={cancel}
      />
      <WidgetButton
        title='Continue'
        appearance='default'
        disabled={currentTokenAddress.length !== 42}
        onClick={() => {
          if (!type) { return }
          setTokenContractData(currentTokenAddress, provider, type, () => {
            history.push(`/campaigns/new?step=initialize`)
          })
        }}
      />
    </WidgetControls>
  </Widget>
}

export default connect(mapStateToProps, mapDispatcherToProps)(CampaignInfo)