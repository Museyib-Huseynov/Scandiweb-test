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

export const GET_PRODUCTS_BY_CATEGORY = (category) => {
  return gql`
    query GetProductsByCategory {
      category(input: { title: "${category}" }) {
        name
        products {
          id
          name
          inStock
          gallery
          description
          category
          attributes {
            id
            name
            type
            items {
              displayValue
              value
              id
            }
          }
          prices {
            currency {
              label
              symbol
            }
            amount
          }
          brand
        }
      }
    }
  `
}

export const GET_SINGLE_PRODUCT = (productID) => {
  return gql`
    query GetSingleProduct {
      product(id: "${productID}") {
        id
        name
        inStock
        gallery
        description
        category
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        brand
      }
    }
  `
}
