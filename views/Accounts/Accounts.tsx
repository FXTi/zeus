import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import Button from '../../components/Button';
import Header from '../../components/Header';
import LayerBalances from '../../components/LayerBalances';
import LoadingIndicator from '../../components/LoadingIndicator';
import Screen from '../../components/Screen';
import { Row } from '../../components/layout/Row';

import BalanceStore from '../../stores/BalanceStore';
import UnitsStore from '../../stores/UnitsStore';
import UTXOsStore from '../../stores/UTXOsStore';
import SettingsStore from '../../stores/SettingsStore';

import BackendUtils from '../../utils/BackendUtils';
import { localeString } from '../../utils/LocaleUtils';
import { themeColor } from '../../utils/ThemeUtils';

import Add from '../../assets/images/SVG/Add.svg';
import Filter from '../../assets/images/SVG/Filter On.svg';

interface AccountsProps {
    navigation: any;
    BalanceStore: BalanceStore;
    UTXOsStore: UTXOsStore;
    UnitsStore: UnitsStore;
    SettingsStore: SettingsStore;
}

interface AccountsState {
    value: string;
    amount: string;
    lightning: string;
    locked: boolean;
    editMode: boolean;
}

@inject('BalanceStore', 'UTXOsStore', 'UnitsStore', 'SettingsStore')
@observer
export default class Accounts extends React.Component<
    AccountsProps,
    AccountsState
> {
    state = {
        value: '',
        amount: '',
        lightning: '',
        locked: false,
        editMode: false
    };

    UNSAFE_componentWillMount() {
        const { UTXOsStore } = this.props;
        if (BackendUtils.supportsAccounts()) UTXOsStore.listAccounts();
    }

    componentDidMount() {
        const { navigation } = this.props;
        const value: string = navigation.getParam('value');
        const amount: string = navigation.getParam('amount');
        const lightning: string = navigation.getParam('lightning');
        const locked: boolean = navigation.getParam('locked');

        if (value) {
            this.setState({
                value
            });
        }

        if (amount) {
            this.setState({
                amount
            });
        }

        if (lightning) {
            this.setState({
                lightning
            });
        }

        if (locked) {
            this.setState({
                locked
            });
        }
    }

    render() {
        const {
            BalanceStore,
            UnitsStore,
            UTXOsStore,
            SettingsStore,
            navigation
        } = this.props;
        const { value, amount, lightning, locked, editMode } = this.state;
        const { loadingAccounts, accounts } = UTXOsStore;

        const FilterButton = () => (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        editMode: !editMode
                    });
                }}
            >
                <Filter
                    style={{ alignSelf: 'center', marginRight: 15 }}
                    fill={themeColor('text')}
                />
            </TouchableOpacity>
        );

        const AddButton = () => (
            <TouchableOpacity
                onPress={() => navigation.navigate('ImportAccount')}
                accessibilityLabel={localeString('general.add')}
            >
                <Add
                    fill={themeColor('text')}
                    width="30"
                    height="30"
                    style={{ alignSelf: 'center' }}
                />
            </TouchableOpacity>
        );

        return (
            <Screen>
                <Header
                    leftComponent="Back"
                    centerComponent={{
                        text: amount
                            ? localeString('views.Accounts.select')
                            : localeString('views.Accounts.title'),
                        style: { color: themeColor('text') }
                    }}
                    rightComponent={
                        value ? null : (
                            <Row>
                                {accounts.length > 0 && <FilterButton />}
                                <AddButton />
                            </Row>
                        )
                    }
                    navigation={navigation}
                />
                {loadingAccounts && <LoadingIndicator />}
                {!loadingAccounts && (
                    <LayerBalances
                        navigation={navigation}
                        BalanceStore={BalanceStore}
                        UnitsStore={UnitsStore}
                        SettingsStore={SettingsStore}
                        onRefresh={async () =>
                            await Promise.all(
                                BackendUtils.supportsAccounts()
                                    ? [
                                          BalanceStore.getBlockchainBalance(),
                                          BalanceStore.getLightningBalance(),
                                          UTXOsStore.listAccounts()
                                      ]
                                    : [
                                          BalanceStore.getBlockchainBalance(),
                                          BalanceStore.getLightningBalance()
                                      ]
                            )
                        }
                        refreshing={
                            BalanceStore.loadingLightningBalance ||
                            BalanceStore.loadingBlockchainBalance ||
                            UTXOsStore.loadingAccounts
                        }
                        // for payment method selection
                        value={value}
                        amount={amount}
                        lightning={lightning}
                        locked={locked}
                        editMode={editMode}
                    />
                )}
                {!loadingAccounts && !!value && !!lightning && (
                    <Button
                        title={localeString('views.Accounts.fetchTxFees')}
                        containerStyle={{
                            margin: 20
                        }}
                        onPress={() =>
                            navigation.navigate('EditFee', {
                                displayOnly: true
                            })
                        }
                    />
                )}
            </Screen>
        );
    }
}
