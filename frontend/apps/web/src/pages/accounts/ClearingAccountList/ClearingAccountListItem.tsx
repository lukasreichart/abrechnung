import { ListItemLink } from "@/components/style/ListItemLink";
import { selectAccountSlice, useAppDispatch, useAppSelector } from "@/store";
import { getAccountLink } from "@/utils";
import {
    accountEditStarted,
    copyAccount,
    selectAccountById,
    selectAccountIdToAccountMap,
    selectCurrentUserPermissions,
} from "@abrechnung/redux";
import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import { Chip, IconButton, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@mui/material";
import { DateTime } from "luxon";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    groupId: number;
    accountId: number;
    setAccountToDelete: (accountID: number) => void;
}

export const ClearingAccountListItem: React.FC<Props> = ({ groupId, accountId, setAccountToDelete }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const permissions = useAppSelector((state) => selectCurrentUserPermissions({ state: state, groupId }));
    const accounts = useAppSelector((state) =>
        selectAccountIdToAccountMap({ state: selectAccountSlice(state), groupId })
    );
    const account = useAppSelector((state) =>
        selectAccountById({ state: selectAccountSlice(state), groupId, accountId })
    );

    if (account.type !== "clearing") {
        return null;
    }

    const participatorNames = Object.keys(account.clearing_shares).map((accountId) => accounts[Number(accountId)].name);

    const edit = () => {
        if (!account.is_wip) {
            dispatch(accountEditStarted({ groupId, accountId }));
        }
        navigate(getAccountLink(groupId, account.type, account.id));
    };

    const copy = () => {
        dispatch(copyAccount({ groupId, accountId }));
    };

    return (
        <ListItem sx={{ padding: 0 }} key={account.id}>
            <ListItemLink sx={{ paddingRight: 17 }} to={getAccountLink(groupId, account.type, account.id)}>
                <ListItemText
                    primaryTypographyProps={{ component: "div" }}
                    secondaryTypographyProps={{ component: "div" }}
                    primary={
                        <>
                            {account.is_wip && (
                                <Chip color="info" variant="outlined" label="WIP" size="small" sx={{ mr: 1 }} />
                            )}
                            <Typography variant="body1" component="span">
                                {account.name}
                            </Typography>
                        </>
                    }
                    secondary={
                        <>
                            <Typography variant="body2" component="span" sx={{ color: "text.primary" }}>
                                {participatorNames.join(", ")}
                            </Typography>
                            <br />
                            {account.date_info &&
                                DateTime.fromISO(account.date_info).toLocaleString(DateTime.DATE_FULL)}
                            {account.tags.map((t) => (
                                <Chip key={t} sx={{ ml: 1 }} variant="outlined" size="small" color="info" label={t} />
                            ))}
                        </>
                    }
                />
            </ListItemLink>
            {permissions.canWrite && (
                <ListItemSecondaryAction>
                    <IconButton color="primary" onClick={edit}>
                        <Edit />
                    </IconButton>
                    <IconButton color="primary" onClick={copy}>
                        <ContentCopy />
                    </IconButton>
                    <IconButton color="error" onClick={() => setAccountToDelete(account.id)}>
                        <Delete />
                    </IconButton>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    );
};

export default ClearingAccountListItem;
