package com.krzyszkowski.loki.mock.properties.validation;

import org.springframework.util.unit.DataSize;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class MaxDataSizeValidator implements ConstraintValidator<MaxDataSize, DataSize> {

    private DataSize dataSize;

    @Override
    public void initialize(MaxDataSize constraintAnnotation) {
        this.dataSize = DataSize.of(constraintAnnotation.value(), constraintAnnotation.unit());
    }

    @Override
    public boolean isValid(DataSize value, ConstraintValidatorContext context) {
        return dataSize.compareTo(value) >= 0;
    }
}
