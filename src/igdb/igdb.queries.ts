export default class IGDBQueries {
  public static searchFields = `
    name,
    cover.id,
    cover.image_id,
    involved_companies.company.name,
    involved_companies.developer,
    involved_companies.porting,
    involved_companies.publisher,
    involved_companies.supporting,
    first_release_date`;

  /**
   *
   */
  public static getGameById = (id: number) => `
      fields
        name,
        aggregated_rating,
        aggregated_rating_count,
        artworks.id,
        artworks.animated,
        artworks.alpha_channel,
        artworks.image_id,
        category,        
        cover.id,
        cover.animated,
        cover.alpha_channel,
        cover.image_id,
        created_at,
        first_release_date,
        game_status,
        genres.id,
        genres.name,
        genres.slug,
        hypes,
        involved_companies.company.id,
        involved_companies.company.logo.image_id,
        involved_companies.company.name,
        involved_companies.company.slug,
        involved_companies.developer,
        involved_companies.porting,
        involved_companies.publisher,
        involved_companies.supporting,
        keywords.id,
        keywords.name,
        keywords.slug,
        name,
        platforms.id,
        platforms.abbreviation,
        platforms.alternative_name,
        platforms.generation,
        platforms.name,
        platforms.platform_logo.image_id,
        platforms.slug,
        platforms.platform_type.name,
        rating,
        rating_count,
        screenshots.id,
        screenshots.animated,
        screenshots.alpha_channel,
        screenshots.image_id,
        similar_games.id,
        similar_games.name,
        similar_games.cover.image_id,
        slug,
        storyline,
        summary,
        themes.id,
        themes.name,
        themes.slug,
        total_rating,
        total_rating_count,
        game_type;
      where id = ${id};
    `;

  /**
   *
   */
  public static getTimeToBeat = (id: number) => `
  fields:
    game_id,
    hastily,
    normally,
    completely,
    count,
    updated_at;
  where game_id = ${id};
  `;

  /**
   *
   */
  public static searchGame = (param: string) => `
    fields: ${this.searchFields};
    limit: 15;
    search "${param}";
  `;

  /**
   *
   */
  public static scrapperSearchGame = (param: string) => `
    fields: name, first_release_date;
    limit: 10;
    search "${param}";
  `;

  /**
   *
   */
  public static searchGameByName = (param: string) => `
    fields: ${this.searchFields};
    limit: 15;
    where name ~ *"${param}"*;
  `;

  /**
   *
   */
  public static getGameBasicInfos = (ids: string, limit: number = 10) => `
    fields: ${this.searchFields};
    limit: ${limit};
    where id = (${ids});
  `;

  /**
   *
   */
  public static getHighlightGame = (id: number | string) => `
    fields:
      ${this.searchFields},
      artworks.image_id;
    where id = ${id};
  `;
}
