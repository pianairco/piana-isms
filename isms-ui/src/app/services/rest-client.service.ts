import {Injectable} from '@angular/core';
import {ConstantService} from "./constant.service";
import {AjaxCallService} from "./ajax-call.service";

@Injectable({
  providedIn: 'root'
})
export class RestClientService {
  ajaxUrlMap = {
    'product': 'api/modules/shop/product',
    'category': 'api/modules/shop/category'
  }

  remoteServer: string = "";

  constructor(private constantService: ConstantService,
              private ajaxCallService: AjaxCallService) { }

  categoryList() {
    return this.ajaxCallService.read(this.ajaxUrlMap.category + '/list');
  }

  categoryPersist(category) {
    if (category.id === 0) {
      return this.ajaxCallService.save(this.ajaxUrlMap.category, category);
    } else{
      return this.ajaxCallService.update(this.ajaxUrlMap.category, category);
    }
  }

  categoryDelete(category) {
    if (category.id > 0) {
      return this.ajaxCallService.delete(this.ajaxUrlMap.category, category.id);
    }
  }

  productDelete(product) {
    if (product.id > 0) {
      return this.ajaxCallService.delete(this.ajaxUrlMap.product, product.id);
    }
  }
}
