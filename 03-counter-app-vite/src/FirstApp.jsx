import PropTypes from 'prop-types';

export const FirstApp = ({title, subTitle}) => {

//Console.log(props);

  return (
    <>
      <h1>{title}</h1>

      <p>{subTitle}</p>
    </>
  )
}



FirstApp.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.number.isRequired,
}

