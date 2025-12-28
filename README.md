# 👻 GhostLink

**Zero-Knowledge, Self-Destructing Messaging Platform.**
*Securely send secrets that vanish forever after being read.*

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## 🛡️ Overview

GhostLink is a secure messaging application designed with a **Zero-Knowledge Architecture**. The server stores encrypted messages but **never** has access to the decryption keys. The keys are ephemeral, generated on the fly, and transported securely via **PASETO (Platform-Agnostic Security Tokens)** within the sharing link.

Once a message is retrieved, it is **permanently destroyed** from the database (Self-Destruct mechanism). Even if the database is compromised, the attacker only sees encrypted gibberish without the keys.

## ✨ Key Features

* **🔒 Zero-Knowledge Storage:** The server acts as a blind storage. It stores the encrypted data but strictly does not know the content.
* **💣 Self-Destruct Mechanism:** Messages are deleted from the database immediately after the first read.
* **🔑 Hybrid Encryption:**
    * **AES-256-GCM:** For encrypting the message payload (Military-grade security).
    * **Ed25519 (via PASETO v4):** For signing the token and ensuring integrity.
* **📦 UUID Identification:** Uses robust Universal Unique Identifiers (UUID) for database indexing.
* **⚡ Modern Stack:** Built with NestJS (Backend) and Next.js 15 (Frontend with React Compiler).

## 🏗️ Architecture Flow

1.  **Encryption (Sender Side):**
    * Server generates an `Ephemeral Key` (AES).
    * Message content is encrypted using `AES-256-GCM`.
    * Server stores the *Encrypted Content*, *IV*, and *AuthTag*.
    * Server **does not save the Key**. The Key is embedded into a signed **PASETO Token**.

2.  **Transport:**
    * The User receives a one-time link containing the PASETO Token.
    * Example: `ghostlink.app/read?token=v4.public.ey...`

3.  **Decryption (Receiver Side):**
    * Receiver clicks the link.
    * Server verifies the PASETO signature (Tamper-proof check).
    * Server retrieves the encrypted blob using the UUID extracted from the token.
    * **Atomic Action:** The message is returned to the user and **IMMEDIATELY DELETED** from the DB.
    * The message is decrypted using the key extracted from the valid token.

## 🚀 Tech Stack

### Backend
* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** PostgreSQL (via TypeORM)
* **Security:** `paseto` (v4), `crypto` (Node.js native)

### Frontend
* **Framework:** Next.js 15 (App Router)
* **Styling:** Tailwind CSS
* **State Management:** React Hooks
* **Optimization:** React Compiler (Experimental)

## 🛠️ Installation & Setup

### Prerequisites
* Node.js (v18+)
* pnpm / npm
* PostgreSQL Database

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/ghostlink.git](https://github.com/yourusername/ghostlink.git)
cd ghostlink
2. Backend Setup
Navigate to the backend folder:

Bash

cd backend
pnpm install
Create a .env file based on the example:

Bash

cp .env.example .env
Configure your .env:

Code snippet

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=ghostlink

# Generate these using: openssl rand -hex 32
PASSPHRASE_PRIVATE_KEY=your_hex_private_key
PASSPHRASE_PUBLIC_KEY=your_hex_public_key

# Optional: Frontend URL for CORS
FRONTEND_URL=http://localhost:3001
Run Backend:

Bash

pnpm start:dev
3. Frontend Setup
Navigate to the frontend folder:

Bash

cd frontend
pnpm install
Create a .env.local file:

Bash

cp .env.example .env.local
Configure your .env.local:

Code snippet

NEXT_PUBLIC_API_URL=http://localhost:3000
Run Frontend:

Bash

pnpm dev


📸 Screenshots
(Place your screenshots here: Homepage, Encrypted Link, Decrypted Message, etc.)

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📄 License
This project is licensed under the MIT License.

Disclaimer: This project is for educational and portfolio purposes. While it uses industry-standard encryption, always exercise caution when sharing highly sensitive data.
