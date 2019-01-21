import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem,
    Button, Modal, ModalHeader, ModalBody, Label, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

function RenderDish({dish}) {
    return (
        <div className="col-12 col-md-5 m-1">
            <Card>
                <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}

function RenderComments({comments, addComment, dishId}) {
    
    const commentSection = comments.map((comment) => {
        return (
            <div key={comment.id}>
                <ul className="list-unstyled">
                    <li>{comment.comment}</li>
                    <li>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</li>
                </ul>
            </div>
        )
    });

    return (
        <div className="col-12 col-md-5 m-1">
            <h4>Comments</h4>
            {commentSection}
            <CommentForm dishId={dishId} addComment={addComment} />
        </div>
    );
}

class CommentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCommentFormOpen: false,
        };
        this.toggleCommentForm = this.toggleCommentForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleCommentForm() {
        this.setState({
            isCommentFormOpen: !this.state.isCommentFormOpen
        });
    }

    handleSubmit(values) {
        this.toggleCommentForm();
        this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render() {
        return(
            <>
                <Button onClick={this.toggleCommentForm}>
                    <span className="fa fa-comment fa-lg"></span> Submit Comment
                </Button>
                <Modal isOpen={this.state.isCommentFormOpen} toggle={this.toggleCommentForm}>
                    <ModalHeader toggle={this.toggleCommentForm}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Col className="form-group">
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select model=".rating" id="rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                </Control.select>
                            </Col>
                            <Col className="form-group">
                                <Label htmlFor="author">Your Name</Label>
                                <Control.text model=".author" id="author" name="author"
                                    placeholder="Your Name"
                                    className="form-control"
                                    validators={{
                                        required, minLength: minLength(3), maxLength: maxLength(15)
                                    }}
                                        />
                                <Errors 
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be greater than 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                />
                            </Col>
                            <Col className="form-group">
                                <Label htmlFor="comment">Comment</Label>
                                <Control.textarea model=".comment" id="comment" name="comment"
                                    rows="8"
                                    className="form-control"
                                    validators={{
                                        required
                                    }}
                                        />
                                <Errors 
                                    className="text-danger"
                                    model=".comment"
                                    show="touched"
                                    messages={{
                                        required: 'Required'
                                    }}
                                />
                            </Col>
                            <Col className="form-group">
                                <Button type="submit" color="primary">
                                Submit
                                </Button>
                            </Col>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

const DishDetail = (props) => {
    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if (props.dish != null) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderDish dish={props.dish} />
                    <RenderComments comments={props.comments}
                        addComment={props.addComment}
                        dishId={props.dish.id}    
                        />
                </div>
            </div>
        );
    }
    else {
        return (
            <div></div>
        );
    }
}

export default DishDetail;