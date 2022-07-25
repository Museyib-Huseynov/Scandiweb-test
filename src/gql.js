import { gql } from '@apollo/client'

export const GET_CATEGORIES_AND_CURRENCIES = gql`
  query GetCategories {
    categories {
      name
    }
    currencies {
      label
      symbol
    }
  }
`
