package com.krzyszkowski.loki.mock.properties.validation;

import org.springframework.util.unit.DataSize;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class MinDataSizeValidator implements ConstraintValidator<MinDataSize, DataSize> {

    private DataSize dataSize;

    @Override
    public void initialize(MinDataSize constraintAnnotation) {
        this.dataSize = DataSize.of(constraintAnnotation.value(), constraintAnnotation.unit());
    }

    @Override
    public boolean isValid(DataSize value, ConstraintValidatorContext context) {
        return dataSize.compareTo(value) <= 0;
    }
}
