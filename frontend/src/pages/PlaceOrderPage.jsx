import React, {useEffect} from 'react';
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
} from 'react-bootstrap'
import { Link } from 'react-router-dom/';

import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import {createOrder} from '../actions/orderActions'

const PlaceOrderPage = ({history}) => {
  const dispatch = useDispatch()

  // const dispatch = useDispatch()
  const cart = useSelector(state => state.cart)
  console.log("CART!!! PLACEORDERPAGE.jsx:::", cart)

  // Fixing decimal lengths to two decimal places
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }
  // Calculating item(s) price
  cart.itemsPrice = addDecimals(cart.cartItems.reduce( (acc, item) => acc + item.price * item.qty, 0))
  // Shipping price (if order is over $100 USD --> free shipping)
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 20)
  cart.taxPrice = addDecimals(Number( (0.10 * cart.itemsPrice).toFixed(2)  ))
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

  const orderCreate = useSelector(state => state.orderCreate)
  const {order, success, error} = orderCreate

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
    }
    // eslint-disable-next-line 
  }, [history, success])

  const placeOrderHandler = () => {
    dispatch(createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice
    }))
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country},
              </p>
            </ListGroup.Item>
            
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0  ? <Message>Your Cart is empty</Message> : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X {item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>

                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>

          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>Order Summary</h3>  
            </ListGroup.Item>
            {/* Items Price */}
            <ListGroup.Item>
              <Row>
                <Col>Items</Col>
                <Col>${cart.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            {/* Shipping Price */}
            <ListGroup.Item>
              <Row>
                <Col>Shipping</Col>
                <Col>${cart.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            {/* Tax Price */}
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col>${cart.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            {/* Total Price */}
            <ListGroup.Item>
              <Row>
                <Col>Total Price</Col>
                <Col>${cart.totalPrice}</Col>
              </Row>
            </ListGroup.Item>

            <ListGroup>
              {error && <Message variant='danger'>{error}</Message>}
            </ListGroup>

            <ListGroup.Item>
              <Button 
                type='button' 
                className='btn-block'
                disabled={cart.cartItems === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderPage
