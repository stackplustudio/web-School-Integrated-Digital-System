import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('billing-types')
  getBillingTypes() {
    return this.financeService.getBillingTypes();
  }

  @Post('billing-types')
  createBillingType(@Body() body: any) {
    return this.financeService.createBillingType(body);
  }

  @Get('invoices')
  getInvoices(@Query('studentId') studentId: string) {
    return this.financeService.getInvoices(studentId);
  }

  @Post('invoices')
  createInvoice(@Body() body: any) {
    return this.financeService.createInvoice(body);
  }

  @Post('invoices/:id/pay')
  payInvoice(@Param('id') id: string, @Body() body: any) {
    return this.financeService.payInvoice(id, body);
  }
}