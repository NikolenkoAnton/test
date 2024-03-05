import { ApiModel, ApiModelProperty } from "swagger-express-ts";
import SiteDomain from "../../db/models/SiteDomain";

@ApiModel({
  name: 'GetDomainsResponseDto',
})
export class GetDomainsResponseDto {
  @ApiModelProperty({
    model: 'SiteDomain',
  })
  rows: SiteDomain[];
}