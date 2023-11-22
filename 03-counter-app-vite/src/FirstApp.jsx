import PropTypes from 'prop-types';

export const FirstApp = ({title, subTitle, name}) => {

//Console.log(props);

  return (
    <>
      <h1>{title}</h1>

      <p>{subTitle}</p>
      <p>{name}</p>
    </>
  )
}



FirstApp.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
}

FirstApp.defaultProps = {
  name: 'Erik Tamayo',
  subTitle: 'ND',
  title: 'ND',
}

