import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';

import BackButton from '../../components/BackButton';

import {
  Container,
  Header,
  HeaderTop,
  HeanderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
} from './styles';

const Profile: React.FC = () => {
  const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');

  const theme = useTheme();
  const { goBack } = useNavigation();

  const handleSinOut = () => {};

  const handleOptionChange = (optionSelected: 'dataEdit' | 'passwordEdit') => {
    setOption(optionSelected);
  };

  return (
    <Container>
      <Header>
        <HeaderTop>
          <BackButton color={theme.colors.shape} onPress={() => goBack()} />
          <HeanderTitle>Editar Perfil</HeanderTitle>
          <LogoutButton onPress={handleSinOut}>
            <Feather name="power" size={24} color={theme.colors.shape} />
          </LogoutButton>
        </HeaderTop>

        <PhotoContainer>
          <Photo source={{ uri: 'https://github.com/charlespereira1.png' }} />

          <PhotoButton onPress={() => {}}>
            <Feather name="camera" size={24} color={theme.colors.shape} />
          </PhotoButton>
        </PhotoContainer>
      </Header>

      <Content>
        <Options>
          <Option
            active={option === 'dataEdit'}
            onPress={() => handleOptionChange('dataEdit')}
          >
            <OptionTitle active={option === 'dataEdit'}>Dados</OptionTitle>
          </Option>
          <Option
            active={option === 'passwordEdit'}
            onPress={() => handleOptionChange('passwordEdit')}
          >
            <OptionTitle active={option === 'passwordEdit'}>
              Trocar senha
            </OptionTitle>
          </Option>
        </Options>
      </Content>
    </Container>
  );
};

export default Profile;
