import { gql } from "@apollo/client";

export const GET_USER_ACTIVITIES = gql`
  query GetUserActivities($user: Bytes!, $first: Int!, $skip: Int!) {
    stakeds(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
      __typename
    }
    withdrawns(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
      __typename
    }
    rewardsClaimeds(where: { user: $user }, first: $first, skip: $skip) {
      id
      user
      amount
      blockTimestamp
      blockNumber
      transactionHash
      __typename
    }
  }
`;

export const GET_REWARDS_AMOUNT = gql`
  query GetUserActivities($user: Bytes!) {
    rewardsClaimeds(where: { user: $user }) {
      amount
    }
  }
`;

export const GET_VOLUME_DATA = gql`
  query {
    volumes(first: 100, orderBy: timestamp, orderDirection: desc) {
      timestamp
      volume
    }
  }
`;
export const GET_TVL_DATA = gql`
  query {
    tvls(first: 100, orderBy: timestamp, orderDirection: desc) {
      timestamp
      tvl
    }
  }
`;

export const GET_SWAP_DATA = gql`
  query($first: Int!, $skip: Int!) {
    swappeds(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
      swapper
      tokenIn
      tokenOut
      amountIn
      amountOut
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_ADD_LIQUIDITY_DATA = gql`
  query($first: Int!, $skip: Int!) {
    liquidityProvideds(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
      provider
      amount1
      amount2
      blockTimestamp
      transactionHash
    }
  }
`;

export const GET_REMOVE_LIQUIDITY_DATA = gql`
  query($first: Int!, $skip: Int!) {
    liquidityRemoveds(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
      provider
      amount1
      amount2
      blockTimestamp
      transactionHash
    }
  }
`;
