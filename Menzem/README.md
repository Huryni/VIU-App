# Sistema de Bater Ponto - Menzem

Sistema de bater ponto em React Native com reconhecimento facial, desenvolvido para controle de presença de funcionários.

## Funcionalidades

### ✅ Implementadas
- **Telas de Login e Cadastro**: Interface completa para autenticação de usuários
- **Validação de Formulários**: Validação em tempo real dos campos de entrada
- **Componentes Reutilizáveis**: Sistema de componentes modulares e organizados
- **Navegação**: Sistema de navegação entre telas usando Expo Router
- **Reconhecimento Facial**: Captura e validação de rostos durante o cadastro
- **Captura Automática**: Sistema de captura de fotos a cada 5 minutos
- **Verificação de Identidade**: Comparação facial para validar usuário
- **Banco de Dados Local**: SQLite para armazenamento de usuários e pontos
- **Geolocalização**: Captura e armazenamento de localização
- **Dashboard Completo**: Interface principal com estatísticas e controles
- **Serviços de Autenticação**: Gerenciamento de estado do usuário logado

### 🚧 Próximas Melhorias
- **Integração com MySQL**: Migração para banco de dados externo
- **API Backend**: Servidor para processamento de dados
- **Notificações Push**: Alertas para captura de fotos
- **Relatórios Avançados**: Estatísticas detalhadas de presença
- **Configurações Avançadas**: Personalização de intervalos e alertas

## Estrutura do Projeto

```
Menzem/
├── app/
│   ├── auth/                 # Telas de autenticação
│   │   ├── login.tsx        # Tela de login
│   │   ├── register.tsx     # Tela de cadastro
│   │   ├── face-recognition.tsx # Tela de reconhecimento facial
│   │   └── _layout.tsx      # Layout das telas de auth
│   ├── dashboard/           # Telas do dashboard
│   │   └── index.tsx        # Dashboard principal
│   └── _layout.tsx          # Layout principal
├── components/
│   ├── global/              # Componentes reutilizáveis
│   │   ├── CustomButton.tsx
│   │   ├── CustomInput.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts
│   └── local/               # Componentes específicos
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       ├── FaceCapture.tsx  # Captura de foto com reconhecimento
│       ├── AutoCapture.tsx  # Captura automática de fotos
│       └── index.ts
├── services/                # Serviços da aplicação
│   ├── DatabaseService.ts   # Gerenciamento do banco SQLite
│   └── AuthService.ts       # Serviço de autenticação
└── ...
```

## Como Usar

### Credenciais de Teste
- **Email**: teste@exemplo.com
- **Senha**: 123456

### Instalação e Execução

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar o projeto**:
   ```bash
   npm start
   ```

3. **Abrir no dispositivo/emulador**:
   - Pressione `a` para Android
   - Pressione `i` para iOS
   - Escaneie o QR code com o Expo Go

## Tecnologias Utilizadas

- **React Native**: Framework principal
- **Expo**: Plataforma de desenvolvimento
- **TypeScript**: Tipagem estática
- **Expo Router**: Navegação
- **Expo Camera**: Captura de fotos
- **Expo Face Detector**: Reconhecimento facial
- **Expo Location**: Geolocalização
- **Expo SQLite**: Banco de dados local
- **AsyncStorage**: Armazenamento local de dados
- **React Native Maps**: Visualização de mapas (opcional)

## Funcionalidades Implementadas

### ✅ Sistema Completo Funcionando
1. **Autenticação Completa**
   - Login e cadastro de usuários
   - Validação de formulários
   - Persistência de sessão

2. **Reconhecimento Facial**
   - Captura de foto durante cadastro
   - Validação de qualidade da imagem
   - Armazenamento seguro dos dados faciais

3. **Sistema de Captura Automática**
   - Timer para captura a cada 5 minutos
   - Verificação de identidade facial
   - Armazenamento com timestamp e localização

4. **Banco de Dados Local**
   - SQLite para armazenamento
   - CRUD completo de usuários e pontos
   - Autenticação segura

5. **Dashboard Completo**
   - Histórico de pontos
   - Estatísticas de presença
   - Controles de captura automática

### 🚧 Próximas Melhorias
1. **Integração com MySQL**
   - Migração para banco de dados externo
   - Sincronização de dados

2. **API Backend**
   - Servidor para processamento de dados
   - Autenticação JWT

3. **Recursos Avançados**
   - Notificações push
   - Relatórios detalhados
   - Configurações personalizadas

## Contribuição

Este projeto está em desenvolvimento ativo. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## Posse.

Este projeto está em posse de Carlos Daniel(Hury) em parceria com Pinho

## Patente

Projeto de pertencimento e patentiado por Pinho
