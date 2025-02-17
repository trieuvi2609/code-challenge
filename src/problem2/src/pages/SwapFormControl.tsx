// src/components/CurrencySwapForm.tsx
import { yupResolver } from "@hookform/resolvers/yup";
import SwapHoriz from "@mui/icons-material/SwapHoriz";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { TOKEN_IMAGE_URL } from "../api/api";
import { fetchTokenPrices, TokenPrice } from "../utils/fetchPrices";

const schema = yup.object().shape({
  fromAmount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  fromToken: yup.string().required("From token is required"),
  toToken: yup
    .string()
    .required("To token is required")
    .notOneOf([yup.ref("fromToken")], "Cannot swap same token"),
});

type FormData = {
  fromAmount: number;
  fromToken: string;
  toToken: string;
};

const CurrencySwapForm: React.FC = () => {
  const [tokens, setTokens] = React.useState<TokenPrice[]>([]);
  const [toAmount, setToAmount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(false);
  console.log("toAmount", toAmount);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    resetField,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fromAmount: 0,
      fromToken: "",
      toToken: "",
    },
  });

  const watchedValues = watch();

  const swapTokens = () => {
    const currentFromToken = watchedValues.fromToken;
    const currentToToken = watchedValues.toToken;
    const currentFromAmount = watchedValues.fromAmount;
    console.log("currentFromAmount", currentFromAmount);

    resetField("fromToken", { defaultValue: currentToToken });
    resetField("toToken", { defaultValue: currentFromToken });
    resetField("fromAmount", { defaultValue: +toAmount.toFixed(4) });
    setToAmount(Number(currentFromAmount));
  };

  useEffect(() => {
    fetchTokenPrices().then((data) => {
      setTokens(data);
      resetField("fromToken", { defaultValue: data[0]?.currency || "" });
      resetField("toToken", { defaultValue: data[1]?.currency || "" });
    });
  }, [resetField]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const fromPrice =
        tokens.find((t) => t.currency === data.fromToken)?.price || 1;
      const toPrice =
        tokens.find((t) => t.currency === data.toToken)?.price || 1;
      setToAmount((data.fromAmount * fromPrice) / toPrice);
      setLoading(false);
    }, 500);
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", p: 4, mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Currency Swap
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* From Amount */}
          <Controller
            name="fromAmount"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.fromAmount}>
                <TextField
                  {...field}
                  label="From Amount"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img
                          src={`${TOKEN_IMAGE_URL}/${watchedValues.fromToken}.svg`}
                          alt={""}
                          style={{ width: 24, height: 24 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText>{errors.fromAmount?.message}</FormHelperText>
              </FormControl>
            )}
          />

          {/* From Token */}
          <Controller
            name="fromToken"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.fromToken}>
                <InputLabel>From Token</InputLabel>
                <Select {...field} label="From Token">
                  {tokens.map((token) => (
                    <MenuItem key={token.currency} value={token.currency}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <img
                          src={`${TOKEN_IMAGE_URL}/${token.currency}.svg`}
                          alt={""}
                          style={{ width: 24, height: 24 }}
                        />
                        <Typography>{token.currency}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.fromToken?.message}</FormHelperText>
              </FormControl>
            )}
          />
          {/* Swap button */}
          <Button
            style={{
              alignSelf: "center",
            }}
            variant="outlined"
            onClick={swapTokens}
            sx={{
              minWidth: "auto",
              p: 1,
              borderRadius: "50%",
              height: 40,
              width: 40,
            }}
          >
            <SwapHoriz />
          </Button>
          {/* To Token */}
          <Controller
            name="toToken"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.toToken}>
                <InputLabel>To Token</InputLabel>
                <Select {...field} label="To Token">
                  {tokens.map((token) => (
                    <MenuItem key={token.currency} value={token.currency}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <img
                          src={`${TOKEN_IMAGE_URL}/${token.currency}.svg`}
                          alt={token.currency}
                          style={{ width: 24, height: 24 }}
                        />
                        <Typography>{token.currency}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.toToken?.message}</FormHelperText>
              </FormControl>
            )}
          />

          {/* To Amount (Readonly) */}
          <FormControl fullWidth>
            <TextField
              label="To Amount"
              type="number"
              value={toAmount.toFixed(4)}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src={`${TOKEN_IMAGE_URL}/${watchedValues.toToken}.svg`}
                      alt={watchedValues.toToken}
                      style={{ width: 24, height: 24 }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Convert"
            )}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CurrencySwapForm;
