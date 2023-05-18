import { Header, Title, ButtonContainer, Button } from './HeaderStyles';

const HeaderComponent = () => {
  return (
    <Header>
      <Title>Collaborative Editing Demo</Title>
      <ButtonContainer>
        <Button>Sign Up</Button>
        <Button>Login</Button>
      </ButtonContainer>
    </Header>
  )
};

export default HeaderComponent;
