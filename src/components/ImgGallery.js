import React from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../context/global_context'

class ImgGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
    }
  }

  static contextType = GlobalContext

  render() {
    return (
      <Wrapper>
        <img
          src={this.props.images[this.state.index]}
          alt='img'
          className='product-image'
        />
        <p
          className='nav lt'
          onClick={() => {
            this.setState({
              index:
                this.state.index === 0
                  ? this.props.images.length - 1
                  : this.state.index - 1,
            })
          }}
        >
          &lt;
        </p>
        <p
          className='nav gt'
          onClick={() => {
            this.setState({
              index:
                this.state.index === this.props.images.length - 1
                  ? 0
                  : this.state.index + 1,
            })
          }}
        >
          &gt;
        </p>
      </Wrapper>
    )
  }
}

export default ImgGallery

const Wrapper = styled.div`
  position: relative;

  .product-image {
    width: 200px;
    height: 288px;
    object-fit: contain;
    grid-area: 1 / 2 / 4 / 3;
  }

  .nav {
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.73);
    color: #fff;
    display: grid;
    place-items: center;
    line-height: 24px;
    user-select: none;
    cursor: pointer;
  }

  .lt {
    position: absolute;
    top: 240px;
    right: 48px;
  }

  .gt {
    position: absolute;
    top: 240px;
    right: 16px;
  }
`
