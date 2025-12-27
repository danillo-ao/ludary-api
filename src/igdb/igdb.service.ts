import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class IgdbService implements OnModuleInit {
  private readonly logger = new Logger(IgdbService.name);
  private readonly client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseURL = 'https://api.igdb.com/v4';

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('IGDB_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('IGDB_CLIENT_SECRET') || '';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Client-ID': this.clientId,
      },
    });

    // Add request interceptor to include the access token
    this.client.interceptors.request.use(
      async (config) => {
        // Check if token is expired or about to expire (within 1 minute)
        if (!this.accessToken || !this.tokenExpiresAt || Date.now() >= this.tokenExpiresAt - 60000) {
          await this.login();
        }

        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        return config;
      },
      (error) => {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject(error);
      },
    );
  }

  // ===============================
  // PRIVATE HELPER METHODS
  // ===============================

  /**
   * Authenticates with Twitch OAuth2 and retrieves an access token.
   * Updates the access token and expiration time for API requests.
   */
  private async login(): Promise<void> {
    try {
      const response = await axios.post<TwitchTokenResponse>('https://id.twitch.tv/oauth2/token', null, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        },
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

      this.logger.log('Successfully authenticated with IGDB API');
    } catch (error) {
      this.logger.error('Failed to authenticate with IGDB API', error);
      throw error;
    }
  }

  // ===============================
  // AUTHENTICATION OPERATIONS
  // ===============================

  /**
   * Initializes the service by authenticating with IGDB API.
   * Called automatically when the module is initialized.
   */
  async onModuleInit(): Promise<void> {
    await this.login();
  }

  /**
   * Manually refreshes the access token.
   * Useful for forcing a token refresh before it expires.
   */
  async refreshToken(): Promise<void> {
    await this.login();
  }

  // ===============================
  // CLIENT OPERATIONS
  // ===============================

  /**
   * Returns the configured axios client instance for making IGDB API requests.
   * The client automatically handles token refresh and includes authentication headers.
   * @returns The axios client instance
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}
