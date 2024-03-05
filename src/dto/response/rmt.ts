import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'GetRmtMarketResponseDto',
})
export class GetRmtMarketResponseDto {
  @ApiModelProperty({
    model: 'MarketResponseDto',
  })
  rows: MarketResponseDto[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;
}

@ApiModel({
  name: 'MarketResponseDto',
})
export class MarketResponseDto {
  @ApiModelProperty()
  market_id: number;

  @ApiModelProperty()
  market: string;

  @ApiModelProperty()
  sport: string;

  @ApiModelProperty()
  bet_quantity: number;

  @ApiModelProperty()
  bet_sum: number;

  @ApiModelProperty()
  profit: number;

  @ApiModelProperty()
  rtp: number;

  @ApiModelProperty()
  max_risk_bet: number;

  @ApiModelProperty()
  delay: number;

  @ApiModelProperty()
  max_risk_player_event: number;

  @ApiModelProperty()
  margin: number;

  @ApiModelProperty()
  active: number;
}

@ApiModel({
  name: 'GetRmtSportByCategoryResponseDto',
})
export class GetRmtSportByCategoryResponseDto {
  @ApiModelProperty({
    model: 'SportByCategoryResponseDto',
  })
  rows: SportByCategoryResponseDto[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;
}

@ApiModel({
  name: 'SportByCategoryResponseDto',
})
export class SportByCategoryResponseDto {
  @ApiModelProperty()
  sport: string;

  @ApiModelProperty()
  category: string;

  @ApiModelProperty()
  competition: string;

  @ApiModelProperty()
  competition_id: number;

  @ApiModelProperty()
  bet_quantity: number;

  @ApiModelProperty()
  bet_sum: number;

  @ApiModelProperty()
  profit: number;

  @ApiModelProperty()
  rtp: number;

  @ApiModelProperty()
  max_risk_bet: number;

  @ApiModelProperty()
  delay: number;

  @ApiModelProperty()
  max_risk_player_event: number;

  @ApiModelProperty()
  margin: number;

  @ApiModelProperty()
  active: number;
}

@ApiModel({
  name: 'GetRmtSportResponseDto',
})
export class GetRmtSportResponseDto {
  @ApiModelProperty({
    model: 'SportResponseDto',
  })
  rows: SportResponseDto[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;
}

@ApiModel({
  name: 'SportResponseDto',
})
export class SportResponseDto {
  @ApiModelProperty()
  sport_id: number;

  @ApiModelProperty()
  sport: string;

  @ApiModelProperty()
  bet_quantity: number;

  @ApiModelProperty()
  bet_sum: number;

  @ApiModelProperty()
  profit: number;

  @ApiModelProperty()
  rtp: number;

  @ApiModelProperty()
  max_risk_bet: number;

  @ApiModelProperty()
  delay: number;

  @ApiModelProperty()
  max_risk_player_event: number;

  @ApiModelProperty()
  margin: number;

  @ApiModelProperty()
  active: number;
}

@ApiModel({
  name: 'GetRmtCategoryResponseDto',
})
export class GetRmtCategoryResponseDto {
  @ApiModelProperty()
  category_id: number;

  @ApiModelProperty()
  category: string;

  @ApiModelProperty()
  profit: number;

  @ApiModelProperty()
  bet_sum: number;

  @ApiModelProperty()
  bet_quantity: number;

  @ApiModelProperty()
  rtp: number;

  @ApiModelProperty()
  max_risk_bet: number;

  @ApiModelProperty()
  delay: number;

  @ApiModelProperty()
  max_risk_player_event: number;

  @ApiModelProperty()
  margin: number;

  @ApiModelProperty()
  active: number;
}

@ApiModel({
  name: 'GetRmtCompetitionResponseDto',
})
export class GetRmtCompetitionResponseDto {
  @ApiModelProperty()
  competition_id: number;

  @ApiModelProperty()
  competition: string;

  @ApiModelProperty()
  bet_quantity: number;

  @ApiModelProperty()
  bet_sum: number;

  @ApiModelProperty()
  profit: number;

  @ApiModelProperty()
  rtp: number;

  @ApiModelProperty()
  max_risk_bet: number;

  @ApiModelProperty()
  delay: number;

  @ApiModelProperty()
  max_risk_player_event: number;

  @ApiModelProperty()
  margin: number;

  @ApiModelProperty()
  active: number;
}

@ApiModel({
  name: 'GetRmtTeamResponseDto',
})
export class GetRmtTeamResponseDto {
  @ApiModelProperty({
    model: 'TeamResponseDto',
  })
  rows: TeamResponseDto[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;
}

@ApiModel({
  name: 'TeamResponseDto',
})
export class TeamResponseDto {
  @ApiModelProperty()
  sport_id: number;

  @ApiModelProperty()
  team: string;

  @ApiModelProperty()
  bet_quantity: number;

  @ApiModelProperty()
  bet_sum: number;

  @ApiModelProperty()
  profit: number;

  @ApiModelProperty()
  rtp: number;

  @ApiModelProperty()
  max_risk_bet: number;

  @ApiModelProperty()
  delay: number;

  @ApiModelProperty()
  max_risk_player_event: number;

  @ApiModelProperty()
  margin: number;

  @ApiModelProperty()
  active: number;
}

export class GetRmtEntityResponseDto<T> {
  rows: T[];
  pages: number;
  current_page: number;
}
