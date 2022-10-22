import React, { useEffect, useState } from "react";
import { DisabledTextField } from "../style/DisabledTextField";
import { useSetRecoilState } from "recoil";
import { pendingTransactionDetailChanges } from "../../state/transactions";
import { Transaction } from "@abrechnung/types";

interface Props {
    transaction: Transaction;
}

export const TransactionValue: React.FC<Props> = ({ transaction }) => {
    const [transactionValue, setTransactionValue] = useState("");
    const [error, setError] = useState(false);
    const setLocalTransactionDetails = useSetRecoilState(pendingTransactionDetailChanges(transaction.id));

    useEffect(() => {
        setTransactionValue(transaction.details.value.toFixed(2));
    }, [transaction, setTransactionValue]);

    const save = () => {
        if (!error && transaction.isWip && transactionValue !== String(transaction.details.value)) {
            setLocalTransactionDetails((currState) => {
                return {
                    ...currState,
                    value: parseFloat(transactionValue),
                };
            });
        }
    };

    const onKeyUp = (key) => {
        if (key.keyCode === 13) {
            save();
        }
    };

    const onChange = (event) => {
        const value = parseFloat(event.target.value);
        if (isNaN(value)) {
            setError(true);
        } else {
            setError(false);
        }
        setTransactionValue(event.target.value);
    };

    return (
        <DisabledTextField
            label="Value"
            helperText={error ? "please input a valid decimal number" : null}
            variant="standard"
            fullWidth
            error={error}
            onChange={onChange}
            onKeyUp={onKeyUp}
            onBlur={save}
            value={transactionValue}
            disabled={!transaction.isWip}
        />
    );
};

export default TransactionValue;
